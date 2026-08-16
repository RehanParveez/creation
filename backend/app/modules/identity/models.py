from __future__ import annotations
from app.models.base import TimestampMixin, Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text
from datetime import datetime
from uuid import UUID, uuid4

class User(TimestampMixin, Base):
  __tablename__ = "users"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid4,
  )
  email: Mapped[str] = mapped_column(
    String(320),
    nullable=False,
    unique=True,
    index=True,
  )
  password_hash: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )
  first_name: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
  )
  last_name: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
  )
  is_active: Mapped[bool] = mapped_column(
    Boolean,
    default=True,
    nullable=False,
    index=True,
  )
  is_verified: Mapped[bool] = mapped_column(
    Boolean,
    default=False,
    nullable=False,
  )
  failed_login_attempts: Mapped[int] = mapped_column(
    default=0,
    nullable=False,
  )
  locked_until: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )
  last_login_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )
  password_changed_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )
  refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
    "RefreshToken",
    back_populates = "user",
    cascade = "all, delete-orphan",
  )
  roles: Mapped[list["Role"]] = relationship(
    "Role",
    secondary = "user_roles",
    back_populates = "users",
  )

  __table_args__ = (Index("ix_users_active_email", "is_active", "email"),)

  @property
  def full_name(self) -> str:
    return f"{self.first_name} {self.last_name}".strip()

class Role(TimestampMixin, Base):
  __tablename__ = "roles"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid4,
  )
  name: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
    unique=True,
    index=True,
  )
  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  is_system: Mapped[bool] = mapped_column(
    Boolean,
    default=True,
    nullable=False,
  )
  users: Mapped[list[User]] = relationship(
    "User",
    secondary = "user_roles",
    back_populates = "roles",
  )
  permissions: Mapped[list["Permission"]] = relationship(
    "Permission",
    secondary = "role_permissions",
    back_populates = "roles",
  )

class Permission(TimestampMixin, Base):
  __tablename__ = "permissions"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid4,
  )
  code: Mapped[str] = mapped_column(
    String(150),
    nullable=False,
    unique=True,
    index=True,
  )
  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  roles: Mapped[list[Role]] = relationship(
    "Role",
    secondary="role_permissions",
    back_populates="permissions",
  )

class UserRole(Base):
  __tablename__ = "user_roles"

  user_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("users.id", ondelete = "CASCADE"),
    primary_key=True,
  )
  role_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("roles.id", ondelete = "CASCADE"),
    primary_key=True,
  )

class RolePermission(Base):
  __tablename__ = "role_permissions"

  role_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("roles.id", ondelete = "CASCADE"),
    primary_key=True,
  )
  permission_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("permissions.id", ondelete = "CASCADE"),
    primary_key=True,
  )

class RefreshToken(TimestampMixin, Base):
  __tablename__ = "refresh_tokens"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid4,
  )
  user_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("users.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )
  token_hash: Mapped[str] = mapped_column(
    String(64),
    nullable=False,
    unique=True,
    index=True,
  )
  expires_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False,
    index=True,
  )
  revoked_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )
  replaced_by_id: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("refresh_tokens.id", ondelete = "SET NULL"),
    nullable=True,
  )
  user_agent: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )
  ip_address: Mapped[str | None] = mapped_column(
    String(64),
    nullable=True,
  )
  user: Mapped[User] = relationship(
    "User",
    back_populates = "refresh_tokens",
  ) 
  replaced_by: Mapped["RefreshToken | None"] = relationship(
    "RefreshToken",
    remote_side = "RefreshToken.id",
  )
  __table_args__ = (
    Index(
      "ix_refresh_tokens_user_active",
      "user_id",
      "revoked_at",
      "expires_at",
    ),
  )