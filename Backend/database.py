import redis.asyncio as aioredis
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from config import settings

mongo_client: AsyncIOMotorClient | None = None
redis_client: aioredis.Redis | None = None


async def connect_to_mongo() -> None:
    global mongo_client
    mongo_client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)


async def close_mongo_connection() -> None:
    global mongo_client
    if mongo_client is not None:
        mongo_client.close()
        mongo_client = None


async def connect_to_redis() -> None:
    global redis_client
    redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)


async def close_redis_connection() -> None:
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        redis_client = None


def get_db() -> AsyncIOMotorDatabase:
    if mongo_client is None:
        raise RuntimeError("MongoDB client is not connected")
    return mongo_client[settings.database_name]
