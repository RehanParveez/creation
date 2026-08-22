from __future__ import annotations
import enum
import uuid
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from sqlalchemy import CheckConstraint, Date, DateTime, Enum, ForeignKey, Index, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class MaterialRequisitionStatus(str, enum.Enum):
  DRAFT = "DRAFT"
  SUBMITTED = "SUBMITTED"
  APPROVED = "APPROVED"
  REJECTED = "REJECTED"
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED"
  FULFILLED = "FULFILLED"
  CANCELLED = "CANCELLED"

class MaterialRequisitionPriority(str, enum.Enum):
  LOW = "LOW"
  NORMAL = "NORMAL"
  HIGH = "HIGH"
  URGENT = "URGENT"

class MaterialRequisition(Base, TimestampMixin):
  __tablename__ = "material_requisitions"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  organization_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "organizations.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
    index=True,
  )
  project_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "projects.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
    index=True,
  )
  requested_by: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "users.id",
      ondelete = "RESTRICT",
    ),
    nullable=False,
    index=True,
  )
  requisition_number: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
    unique=True,
    index=True,
  )
  title: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )
  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  priority: Mapped[MaterialRequisitionPriority] = mapped_column(
    Enum(
      MaterialRequisitionPriority,
      name = "material_requisition_priority",
    ),
    default=MaterialRequisitionPriority.NORMAL,
    nullable=False,
    index=True,
  )
  status: Mapped[MaterialRequisitionStatus] = mapped_column(
    Enum(
      MaterialRequisitionStatus,
      name="material_requisition_status",
    ),
    default=MaterialRequisitionStatus.DRAFT,
    nullable=False,
    index=True,
  )
  needed_by: Mapped[date | None] = mapped_column(
    Date,
    nullable=True,
  )
  approved_by: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "users.id",
      ondelete = "SET NULL",
    ),
    nullable=True,
  )
  approved_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )
  rejection_reason: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  organization = relationship(
    "Organization",
    lazy = "joined",
  )
  project = relationship(
    "Project",
    lazy = "joined",
  )
  requester = relationship(
    "User",
    foreign_keys=[requested_by],
    lazy = "joined",
  )
  approver = relationship(
    "User",
    foreign_keys=[approved_by],
    lazy = "joined",
  )
  items = relationship(
    "MaterialRequisitionItem",
    back_populates = "requisition",
    cascade = "all, delete-orphan",
    order_by = "MaterialRequisitionItem.item_code",
  )

  __table_args__ = (
    Index(
      "ix_material_requisitions_org_status",
      "organization_id",
      "status",
    ),
    Index(
      "ix_material_requisitions_project_status",
      "project_id",
      "status",
    ),
  )

class MaterialRequisitionItem(Base, TimestampMixin):
  __tablename__ = "material_requisition_items"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  requisition_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "material_requisitions.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
    index=True,
  )
  item_code: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )
  material_name: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )
  description: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )
  unit: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )
  requested_quantity: Mapped[Decimal] = mapped_column(
    Numeric(18, 4),
    nullable=False,
  )
  approved_quantity: Mapped[Decimal] = mapped_column(
    Numeric(18, 4),
    nullable=False,
    default=Decimal("0.0000"),
  )
  fulfilled_quantity: Mapped[Decimal] = mapped_column(
    Numeric(18, 4),
    nullable=False,
    default=Decimal("0.0000"),
  )
  notes: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  requisition = relationship(
    "MaterialRequisition",
    back_populates = "items",
  )

  __table_args__ = (
    UniqueConstraint(
      "requisition_id",
      "item_code",
      name = "uq_material_requisition_item_code",
    ),
    CheckConstraint(
      "requested_quantity > 0",
      name = "ck_material_req_requested_qty_positive",
    ),
    CheckConstraint(
      "approved_quantity >= 0",
      name = "ck_material_req_approved_qty_nonnegative",
    ),
    CheckConstraint(
      "fulfilled_quantity >= 0",
      name = "ck_material_req_fulfilled_qty_nonnegative",
    ),
    CheckConstraint(
      "approved_quantity <= requested_quantity",
      name = "ck_material_req_approved_qty_lte_requested",
    ),
    CheckConstraint(
      "fulfilled_quantity <= approved_quantity",
      name = "ck_material_req_fulfilled_qty_lte_approved",
    ),
  )