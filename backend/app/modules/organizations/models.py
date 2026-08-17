from __future__ import annotations
import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, SoftDeleteMixin, TimestampMixin


if TYPE_CHECKING:
  from app.modules.identity.models import Role, User


class Organization(Base, TimestampMixin, SoftDeleteMixin):
  __tablename__ = "organizations"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  name: Mapped[str] = mapped_column(
    String(160),
    nullable=False,
  )
  slug: Mapped[str] = mapped_column(
    String(180),
    nullable=False,
    unique=True,
    index=True,
  )
  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  logo_url: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )
  website: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )
  address: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )
  phone: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
  )
  email: Mapped[str | None] = mapped_column(
    String(320),
    nullable=True,
  )
  currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
    default = "PKR",
  )
  timezone: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
    default = "Asia/Karachi",
  )
  memberships: Mapped[list["OrganizationMembership"]] = relationship(
    "OrganizationMembership",
    back_populates = "organization",
    cascade = "all, delete-orphan",
    lazy = "selectin",
  )

class OrganizationMembership(Base, TimestampMixin):
  __tablename__ = "organization_memberships"

  __table_args__ = (
    UniqueConstraint(
      "organization_id",
      "user_id",
      name = "uq_organization_membership_org_user",
    ),
    Index(
      "ix_organization_memberships_user_id",
      "user_id",
    ),
    Index(
      "ix_organization_memberships_organization_id",
      "organization_id",
    ),
  )
  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  organization_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "organizations.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
  )
  user_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "users.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
  )
  role_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "roles.id",
      ondelete = "RESTRICT",
    ),
    nullable=False,
  )
  joined_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    default=datetime.utcnow,
    nullable=False,
  )
  is_default: Mapped[bool] = mapped_column(
    Boolean,
    default=False,
    nullable=False,
  )
  organization: Mapped["Organization"] = relationship(
    "Organization",
    back_populates = "memberships",
  )
  user: Mapped["User"] = relationship(
    "User",
    lazy = "joined",
  )
  role: Mapped["Role"] = relationship(
    "Role",
    lazy = "joined",
  )