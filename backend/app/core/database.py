from typing import AsyncGenerator
from app.core.config import get_settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

settings = get_settings()

engine = create_async_engine(
  settings.database.async_url,
  echo=settings.app_debug,
  pool_pre_ping=True,
  pool_size=10,
  max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
  engine,
  class_=AsyncSession,
  expire_on_commit=False,
  autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
  async with AsyncSessionLocal() as session:
    try:
      yield session
    finally:
      await session.close()