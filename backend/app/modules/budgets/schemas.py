from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from app.modules.budgets.models import BudgetItemCategory, BudgetStatus
from decimal import Decimal
from uuid import UUID
from datetime import datetime

class BudgetItemBase(BaseModel):
  item_code: str = Field(min_length=1, max_length=50)
  description: str = Field(min_length=1, max_length=500)
  category: BudgetItemCategory
  unit: str = Field(min_length=1, max_length=50)

  planned_quantity: Decimal = Field(
    gt=0,
    max_digits=18,
    decimal_places=4,
  )

  estimated_unit_cost: Decimal = Field(
    ge=0,
    max_digits=18,
    decimal_places=2,
  )

class BudgetItemCreate(BudgetItemBase):
  pass

class BudgetItemUpdate(BaseModel):
  item_code: str | None = Field(
    default=None,
    min_length=1,
    max_length=50,
  )

  description: str | None = Field(
    default=None,
    min_length=1,
    max_length=500,
  )

  category: BudgetItemCategory | None = None

  unit: str | None = Field(
    default=None,
    min_length=1,
    max_length=50,
  )

  planned_quantity: Decimal | None = Field(
    default=None,
    gt=0,
    max_digits=18,
    decimal_places=4,
  )

  estimated_unit_cost: Decimal | None = Field(
    default=None,
    ge=0,
    max_digits=18,
    decimal_places=2,
  )

class BudgetItemOut(BudgetItemBase):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  budget_id: UUID
  estimated_total_cost: Decimal
  actual_cost: Decimal
  created_at: datetime

class BudgetBase(BaseModel):
  name: str = Field(
    min_length=1,
    max_length=200,
  )

  description: str | None = None

class BudgetCreate(BudgetBase):
  pass

class BudgetUpdate(BaseModel):
  name: str | None = Field(
    default=None,
    min_length=1,
    max_length=200,
  )

  description: str | None = None

class BudgetOut(BudgetBase):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  organization_id: UUID
  project_id: UUID
  status: BudgetStatus
  approved_at: datetime | None
  approved_by: UUID | None
  rejection_reason: str | None
  items: list[BudgetItemOut] = []

class BudgetSummary(BaseModel):
  budget_id: UUID
  project_id: UUID
  status: BudgetStatus
  estimated_budget: Decimal
  approved_budget: Decimal
  actual_cost: Decimal
  committed_cost: Decimal
  remaining_budget: Decimal
  usage_percentage: Decimal