from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime
from sqlalchemy import DateTime, Boolean

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
  is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)