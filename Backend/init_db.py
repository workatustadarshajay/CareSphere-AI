import asyncio
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from config import settings

SAMPLE_DOCTORS = [
    {
        "name": "Dr. Ananya Sharma",
        "specialty": "Cardiology",
        "experience": 15,
        "rating": 4.9,
        "available": True,
        "location": "Downtown",
    },
    {
        "name": "Dr. Rohan Mehta",
        "specialty": "Dermatology",
        "experience": 8,
        "rating": 4.7,
        "available": True,
        "location": "Midtown",
    },
    {
        "name": "Dr. Priya Nair",
        "specialty": "Neurology",
        "experience": 12,
        "rating": 4.8,
        "available": False,
        "location": "Uptown",
    },
    {
        "name": "Dr. Arjun Kapoor",
        "specialty": "Pediatrics",
        "experience": 10,
        "rating": 4.6,
        "available": True,
        "location": "Downtown",
    },
    {
        "name": "Dr. Sara Iyer",
        "specialty": "Orthopedics",
        "experience": 18,
        "rating": 4.9,
        "available": True,
        "location": "Suburb Clinic",
    },
]


async def init_database() -> None:
    client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
    db = client[settings.database_name]

    await db.create_collection("users")
    await db.create_collection("doctors")
    await db.create_collection("appointments")
    await db.create_collection("documents")

    await db.users.create_index("email", unique=True)
    await db.appointments.create_index([("user_id", 1), ("created_at", -1)])

    doctors = [{**doc, "created_at": datetime.now(timezone.utc)} for doc in SAMPLE_DOCTORS]
    await db.doctors.insert_many(doctors)

    client.close()


if __name__ == "__main__":
    asyncio.run(init_database())
