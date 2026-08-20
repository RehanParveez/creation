from __future__ import annotations
import enum
from app.models.base import Base, TimestampMixin
from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from sqlalchemy import ForeignKey, String, Text, Enum, DateTime, UniqueConstraint, Index, Numeric, CheckConstraint
from decimal import Decimal

class BudgetStatus(str, enum.Enum):
  DRAFT = "DRAFT"
  PENDING_APPROVAL = "PENDING_APPROVAL"
  APPROVED = "APPROVED"
  REJECTED = "REJECTED"

class BudgetItemCategory(str, enum.Enum):
  MATERIALS = "MATERIALS"
  LABOUR = "LABOUR"
  EQUIPMENT = "EQUIPMENT"
  SUBCONTRACTOR = "SUBCONTRACTOR"
  OTHER = "OTHER"

class Budget(Base, TimestampMixin):
  __tablename__ = "budgets"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  organization_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("organizations.id", ondelete = "CASCADE"),
    nullable=False, 
    index=True,
  )

  project_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("projects.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  name: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )

  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  status: Mapped[BudgetStatus] = mapped_column(
    Enum(BudgetStatus, name = "budget_status"),
    default=BudgetStatus.DRAFT,
    nullable=False,
    index=True,
  )

  approved_at: Mapped[object | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )

  approved_by: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("users.id", ondelete = "SET NULL"),
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

  approver = relationship(
    "User",
    foreign_keys=[approved_by],
    lazy = "joined",
  )

  items = relationship(
    "BudgetItem",
    back_populates = "budget",
    cascade = "all, delete-orphan",
    order_by = "BudgetItem.item_code",
  )

  __table_args__ = (
    UniqueConstraint(
      "project_id",
      name = "uq_budget_project",
    ),
    Index(
      "ix_budgets_org_status",
      "organization_id",
      "status",
    ),
  )

class BudgetItem(Base, TimestampMixin):
  __tablename__ = "budget_items"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  budget_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("budgets.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  item_code: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )

  description: Mapped[str] = mapped_column(
    String(500),
    nullable=False,
  )

  category: Mapped[BudgetItemCategory] = mapped_column(
    Enum(
      BudgetItemCategory,
      name = "budget_item_category",
    ),
    nullable=False,
    index=True,
  )

  unit: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )

  planned_quantity: Mapped[Decimal] = mapped_column(
    Numeric(18, 4),
    nullable=False,
  )

  estimated_unit_cost: Mapped[Decimal] = mapped_column(
    Numeric(18, 2),
    nullable=False,
  )

  estimated_total_cost: Mapped[Decimal] = mapped_column(
    Numeric(18, 2),
    nullable=False,
  )

  actual_cost: Mapped[Decimal] = mapped_column(
    Numeric(18, 2),
    nullable=False,
    default=Decimal("0.00"),
  )

  budget = relationship(
    "Budget",
    back_populates = "items",
  )

  __table_args__ = (
    UniqueConstraint(
      "budget_id",
      "item_code",
      name="uq_budget_item_code",
    ),
    CheckConstraint(
      "planned_quantity > 0",
      name="ck_budget_item_quantity_positive",
    ),
    CheckConstraint(
      "estimated_unit_cost >= 0",
      name="ck_budget_item_unit_cost_nonnegative",
    ),
    CheckConstraint(
      "estimated_total_cost >= 0",
      name="ck_budget_item_total_nonnegative",
    ),
    CheckConstraint(
      "actual_cost >= 0",
      name="ck_budget_item_actual_nonnegative",
    ),
  )