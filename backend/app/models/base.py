from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime, timezone
from sqlalchemy import DateTime, Boolean

def utc_now() -> datetime:
  return datetime.now(timezone.utc)
  
class Base(DeclarativeBase):
  pass

class TimestampMixin:
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), default=datetime.utcnow, nullable=False
  )
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    default=datetime.utcnow,
    onupdate=datetime.utcnow,
    nullable=False,
  )

class SoftDeleteMixin:
  is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True,
  )
  archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True,
  )