from __future__ import annotations
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.modules.materials_requests.models import MaterialRequisitionPriority, MaterialRequisitionStatus

class MaterialRequisitionItemBase(BaseModel):
  item_code: str = Field(
    min_length=1,
    max_length=50,
  )
  material_name: str = Field(
    min_length=1,
    max_length=200,
  )
  description: str | None = Field(
    default=None,
    max_length=500,
  )
  unit: str = Field(
    min_length=1,
    max_length=50,
  )
  requested_quantity: Decimal = Field(
    gt=0,
    max_digits=18,
    decimal_places=4,
  )
  notes: str | None = None

class MaterialRequisitionItemCreate(
  MaterialRequisitionItemBase
):
  pass

class MaterialRequisitionItemUpdate(BaseModel):
  item_code: str | None = Field(
    default=None,
    min_length=1,
    max_length=50,
  )
  material_name: str | None = Field(
    default=None,
    min_length=1,
    max_length=200,
  )
  description: str | None = Field(
    default=None,
    max_length=500,
  )
  unit: str | None = Field(
    default=None,
    min_length=1,
    max_length=50,
  )
  requested_quantity: Decimal | None = Field(
    default=None,
    gt=0,
    max_digits=18,
    decimal_places=4,
  )
  notes: str | None = None

class MaterialRequisitionItemOut(
  MaterialRequisitionItemBase
):
  model_config = ConfigDict(
    from_attributes=True
  )
  id: UUID
  requisition_id: UUID
  approved_quantity: Decimal
  fulfilled_quantity: Decimal
  created_at: datetime

class MaterialRequisitionBase(BaseModel):
  title: str = Field(
    min_length=1,
    max_length=200,
  )

  description: str | None = None
  priority: MaterialRequisitionPriority = (
    MaterialRequisitionPriority.NORMAL
  )
  needed_by: date | None = None

class MaterialRequisitionCreate(
  MaterialRequisitionBase
):
  pass

class MaterialRequisitionUpdate(BaseModel):
  title: str | None = Field(
    default=None,
    min_length=1,
    max_length=200,
  )

  description: str | None = None
  priority: MaterialRequisitionPriority | None = None
  needed_by: date | None = None

class MaterialRequisitionOut(
  MaterialRequisitionBase
):
  model_config = ConfigDict(
    from_attributes=True
  )

  id: UUID
  organization_id: UUID
  project_id: UUID
  requested_by: UUID
  requisition_number: str
  status: MaterialRequisitionStatus
  approved_by: UUID | None
  approved_at: datetime | None
  rejection_reason: str | None
  created_at: datetime
  items: list[
    MaterialRequisitionItemOut
  ] = []

class MaterialRequisitionApprovalItem(
  BaseModel
):
  item_id: UUID
  approved_quantity: Decimal = Field(
    ge=0,
    max_digits=18,
    decimal_places=4,
  )

class MaterialRequisitionApprove(BaseModel):
  items: list[
    MaterialRequisitionApprovalItem
  ]

class MaterialRequisitionReject(BaseModel):
  reason: str = Field(
    min_length=1,
    max_length=2000,
  )

class MaterialRequisitionFulfillmentItem(
  BaseModel
):
  item_id: UUID

  fulfilled_quantity: Decimal = Field(
    gt=0,
    max_digits=18,
    decimal_places=4,
  )

class MaterialRequisitionFulfill(BaseModel):
  items: list[
    MaterialRequisitionFulfillmentItem
  ]

class MaterialRequisitionSummary(BaseModel):
  requisition_id: UUID
  project_id: UUID
  status: MaterialRequisitionStatus
  priority: MaterialRequisitionPriority
  total_items: int
  total_requested_quantity: Decimal
  total_approved_quantity: Decimal
  total_fulfilled_quantity: Decimal
  fulfillment_percentage: Decimal