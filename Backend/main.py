import re
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any

from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from bson import ObjectId

import ai_service
from auth import create_access_token, get_current_user_id, get_password_hash, verify_password
from config import settings
from database import (
    close_mongo_connection,
    close_redis_connection,
    connect_to_mongo,
    connect_to_redis,
    get_db,
)
from schemas import (
    Appointment,
    AppointmentRequest,
    Doctor,
    HealthResponse,
    SymptomRequest,
    SymptomResponse,
    Token,
    User,
    UserLogin,
    UserRegister,
)

limiter = Limiter(key_func=get_remote_address)


async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )


@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    await connect_to_mongo()
    await connect_to_redis()
    yield
    await close_mongo_connection()
    await close_redis_connection()


app = FastAPI(title="CareSphere AI", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def oid_to_str(doc: dict[str, Any]) -> dict[str, Any]:
    if doc.get("_id") is not None:
        doc["_id"] = str(doc["_id"])
    return doc


def to_oid(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid id format") from exc


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/auth/register", response_model=Token)
@limiter.limit("5/minute")
async def register(request: Request, payload: UserRegister) -> Token:
    db = get_db()
    existing = await db["users"].find_one({"email": payload.email})
    if existing is not None:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "email": payload.email,
        "password_hash": get_password_hash(payload.password),
        "name": payload.name,
        "age": payload.age,
        "medical_history": payload.medical_history,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["users"].insert_one(user_doc)
    token = create_access_token(str(result.inserted_id))
    return Token(access_token=token, user_id=str(result.inserted_id))


@app.post("/auth/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, payload: UserLogin) -> Token:
    db = get_db()
    user = await db["users"].find_one({"email": payload.email})
    if user is None or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token(str(user["_id"]))
    return Token(access_token=token, user_id=str(user["_id"]))


@app.get("/users/profile", response_model=User)
@limiter.limit("100/minute")
async def profile(request: Request, user_id: str = Depends(get_current_user_id)) -> User:
    db = get_db()
    user = await db["users"].find_one({"_id": to_oid(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop("password_hash", None)
    return User(**oid_to_str(user))


@app.post("/symptoms/analyze", response_model=SymptomResponse)
@limiter.limit("20/minute")
async def analyze(
    request: Request,
    payload: SymptomRequest,
    user_id: str = Depends(get_current_user_id),
) -> SymptomResponse:
    result = await ai_service.analyze_symptoms(payload)
    return SymptomResponse(**result)


@app.post("/documents/analyze")
@limiter.limit("10/minute")
async def analyze_document_endpoint(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    doc_type: str = Form("lab_report"),
    file: UploadFile = File(...),
) -> dict[str, Any]:
    if not file.content_type or not file.content_type.startswith(("image/", "application/pdf", "text/")):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")
    analysis = await ai_service.analyze_document(contents, file.content_type, doc_type)
    db = get_db()
    doc = {
        "user_id": user_id,
        "doc_type": doc_type,
        "filename": file.filename,
        "extracted_data": analysis.get("extracted_data", {}),
        "plain_language": analysis.get("plain_language", ""),
        "next_steps": analysis.get("next_steps", []),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["documents"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@app.get("/doctors/search", response_model=list[Doctor])
@limiter.limit("50/minute")
async def search_doctors(
    request: Request,
    specialty: str | None = Query(default=None),
    location: str | None = Query(default=None),
) -> list[Doctor]:
    db = get_db()
    query: dict[str, Any] = {}
    if specialty:
        query["specialty"] = {"$regex": re.escape(specialty), "$options": "i"}
    if location:
        query["location"] = {"$regex": re.escape(location), "$options": "i"}
    cursor = db["doctors"].find(query).limit(50)
    return [Doctor(**oid_to_str(doc)) async for doc in cursor]


@app.post("/appointments/book", response_model=Appointment)
@limiter.limit("10/minute")
async def book_appointment(
    request: Request,
    payload: AppointmentRequest,
    user_id: str = Depends(get_current_user_id),
) -> Appointment:
    db = get_db()
    doctor = await db["doctors"].find_one({"_id": to_oid(payload.doctor_id)})
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    if not doctor.get("available", False):
        raise HTTPException(status_code=400, detail="Doctor is not available")
    appointment_doc = {
        "user_id": user_id,
        "doctor_id": payload.doctor_id,
        "doctor_name": doctor.get("name"),
        "date": payload.date,
        "time": payload.time,
        "status": "scheduled",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["appointments"].insert_one(appointment_doc)
    appointment_doc["_id"] = str(result.inserted_id)
    return Appointment(**appointment_doc)


@app.get("/appointments/list", response_model=list[Appointment])
@limiter.limit("50/minute")
async def list_appointments(
    request: Request,
    user_id: str = Depends(get_current_user_id),
) -> list[Appointment]:
    db = get_db()
    cursor = db["appointments"].find({"user_id": user_id}).sort("created_at", -1)
    return [Appointment(**oid_to_str(doc)) async for doc in cursor]
