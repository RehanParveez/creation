from app.core.config import get_settings
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from fastapi import Depends, Request

settings = get_settings()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
  async with AsyncSessionLocal() as session:
    yield session

async def get_request_id(request: Request) -> str:
  return request.headers.get("x-request-id", "") or ""