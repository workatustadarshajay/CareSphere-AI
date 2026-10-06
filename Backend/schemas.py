from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=100)
    age: int = Field(ge=0, le=120)
    medical_history: str = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


class UserUpdate(BaseModel):
    name: str | None = None
    age: int | None = Field(default=None, ge=0, le=120)
    medical_history: str | None = None


class User(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    name: str
    age: int | None = None
    medical_history: str = ""
    created_at: datetime | None = None

    model_config = {"populate_by_name": True}


class Condition(BaseModel):
    name: str
    probability: float


class SymptomRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1)
    age: int = Field(ge=0, le=120)
    medical_history: str = ""


class SymptomResponse(BaseModel):
    severity: str
    possible_conditions: list[Condition]
    specialists: list[str]
    emergency_signs: str
    recommendation: str = ""


class Doctor(BaseModel):
    id: str = Field(alias="_id")
    name: str
    specialty: str
    experience: int
    rating: float
    available: bool
    location: str

    model_config = {"populate_by_name": True}


class AppointmentRequest(BaseModel):
    doctor_id: str
    date: str
    time: str


class Appointment(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    doctor_id: str
    doctor_name: str | None = None
    date: str
    time: str
    status: str = "scheduled"
    created_at: datetime | None = None

    model_config = {"populate_by_name": True}


class DocumentAnalysis(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    doc_type: str
    filename: str
    extracted_data: dict[str, Any] = {}
    plain_language: str
    next_steps: list[str] = []
    created_at: datetime | None = None

    model_config = {"populate_by_name": True}


class HealthResponse(BaseModel):
    status: str
