from __future__ import annotations
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ConflictException, NotFoundException, ValidationException
from app.modules.materials_requests.models import MaterialRequisition, MaterialRequisitionItem, MaterialRequisitionStatus
from app.modules.materials_requests.repository import material_requisition_repo, material_requisition_item_repo
from app.modules.materials_requests.schemas import MaterialRequisitionApprove, MaterialRequisitionCreate, MaterialRequisitionFulfill, MaterialRequisitionItemCreate, MaterialRequisitionItemUpdate, MaterialRequisitionReject, MaterialRequisitionUpdate

class MaterialRequisitionService:

  @staticmethod
  def generate_requisition_number() -> str:
    return (
      f"MR-{datetime.now(timezone.utc):%Y%m%d}-"
      f"{uuid.uuid4().hex[:8].upper()}"
    )

  @staticmethod
  async def create_requisition(
    db: AsyncSession,
    requisition_in: MaterialRequisitionCreate,
    organization_id: UUID,
    project_id: UUID,
    requested_by: UUID,
  ) -> MaterialRequisition:

    data = requisition_in.model_dump()
    data["organization_id"] = organization_id
    data["project_id"] = project_id
    data["requested_by"] = requested_by
    data["requisition_number"] = (
      MaterialRequisitionService
      .generate_requisition_number()
    )
    data["status"] = (
      MaterialRequisitionStatus.DRAFT
    )
    return await material_requisition_repo.create(
      db,
      data,
    )

  @staticmethod
  async def get_requisition_or_404(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
  ) -> MaterialRequisition:

    requisition = (
      await material_requisition_repo
      .get_by_id_and_org(
        db,
        requisition_id,
        organization_id,
      )
    )

    if not requisition:
      raise NotFoundException(
        "Material requisition"
      )
    return requisition

  @staticmethod
  def _ensure_editable(
    requisition: MaterialRequisition,
  ) -> None:

    if requisition.status not in (
      MaterialRequisitionStatus.DRAFT,
      MaterialRequisitionStatus.REJECTED,
    ):
      raise ValidationException(
        message=(
          "This material requisition "
          "cannot be modified in its "
          "current state."
        )
      )

  @staticmethod
  async def update_requisition(
    db: AsyncSession,
    requisition_id: UUID,
    requisition_in: MaterialRequisitionUpdate,
    organization_id: UUID,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    MaterialRequisitionService._ensure_editable(
      requisition
    )
    data = requisition_in.model_dump(
      exclude_unset=True
    )

    for field, value in data.items():
      setattr(
        requisition,
        field,
        value,
      )

    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  async def delete_requisition(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
  ) -> None:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    MaterialRequisitionService._ensure_editable(
      requisition
    )
    await material_requisition_repo.delete(
      db,
      requisition,
    )

  @staticmethod
  async def add_item(
    db: AsyncSession,
    requisition_id: UUID,
    item_in: MaterialRequisitionItemCreate,
    organization_id: UUID,
  ) -> MaterialRequisitionItem:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    MaterialRequisitionService._ensure_editable(
      requisition
    )
    existing_items = (
      await material_requisition_item_repo
      .get_by_requisition(
        db,
        requisition_id,
      )
    )

    if any(
      item.item_code == item_in.item_code
      for item in existing_items
    ):
      raise ConflictException(
        message=(
          "An item with this item code "
          "already exists in the requisition."
        )
      )
    data = item_in.model_dump()
    data["requisition_id"] = requisition.id
    data["approved_quantity"] = Decimal(
      "0.0000"
    )
    data["fulfilled_quantity"] = Decimal(
      "0.0000"
    )
    return await (
      material_requisition_item_repo.create(
        db,
        data,
      )
    )

  @staticmethod
  async def update_item(
    db: AsyncSession,
    requisition_id: UUID,
    item_id: UUID,
    item_in: MaterialRequisitionItemUpdate,
    organization_id: UUID,
  ) -> MaterialRequisitionItem:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    MaterialRequisitionService._ensure_editable(
      requisition
    )
    item = (
      await material_requisition_item_repo
      .get_by_id_and_requisition(
        db,
        item_id,
        requisition_id,
      )
    )
    if not item:
      raise NotFoundException(
        "Material requisition item"
      )
    data = item_in.model_dump(
      exclude_unset=True
    )
    if "item_code" in data:
      existing_items = (
        await material_requisition_item_repo
        .get_by_requisition(
          db,
          requisition_id,
        )
      )
      duplicate = any(
        other.id != item.id
        and other.item_code == data["item_code"]
        for other in existing_items
      )
      if duplicate:
        raise ConflictException(
          message=(
            "An item with this item code "
            "already exists."
          )
        )

    for field, value in data.items():
      if value is not None:
        setattr(
          item,
          field,
          value,
        )
    await db.commit()
    await db.refresh(item)
    return item

  @staticmethod
  async def delete_item(
    db: AsyncSession,
    requisition_id: UUID,
    item_id: UUID,
    organization_id: UUID,
  ) -> None:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    MaterialRequisitionService._ensure_editable(
      requisition
    )
    item = (
      await material_requisition_item_repo
      .get_by_id_and_requisition(
        db,
        item_id,
        requisition_id,
      )
    )
    if not item:
      raise NotFoundException(
        "Material requisition item"
      )
    await material_requisition_item_repo.delete(
      db,
      item,
    )

  @staticmethod
  async def submit(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    if requisition.status not in (
      MaterialRequisitionStatus.DRAFT,
      MaterialRequisitionStatus.REJECTED,
    ):
      raise ValidationException(
        message=(
          "Only draft or rejected "
          "requisitions can be submitted."
        )
      )
    if not requisition.items:
      raise ValidationException(
        message=(
          "A material requisition must "
          "contain at least one item."
        )
      )
    requisition.status = (
      MaterialRequisitionStatus.SUBMITTED
    )
    requisition.rejection_reason = None
    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  async def approve(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
    approver_id: UUID,
    approval_in: MaterialRequisitionApprove,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    if requisition.status != (
      MaterialRequisitionStatus.SUBMITTED
    ):
      raise ValidationException(
        message=(
          "Only submitted material "
          "requisitions can be approved."
        )
      )

    items = {
      item.id: item
      for item in requisition.items
    }
    if not approval_in.items:
      raise ValidationException(
        message=(
          "At least one item approval "
          "is required."
        )
      )

    for approval in approval_in.items:

      item = items.get(
        approval.item_id
      )
      if not item:
        raise NotFoundException(
          "Material requisition item"
        )

      if (
        approval.approved_quantity
        > item.requested_quantity
      ):
        raise ValidationException(
          message=(
            f"Approved quantity for "
            f"{item.item_code} cannot exceed "
            f"requested quantity."
          )
        )
      item.approved_quantity = (
        approval.approved_quantity
      )
    requisition.status = (
      MaterialRequisitionStatus.APPROVED
    )
    requisition.approved_by = approver_id
    requisition.approved_at = (
      datetime.now(timezone.utc)
    )
    requisition.rejection_reason = None
    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  async def reject(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
    rejection_in: MaterialRequisitionReject,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    if requisition.status != (
      MaterialRequisitionStatus.SUBMITTED
    ):
      raise ValidationException(
        message=(
          "Only submitted material "
          "requisitions can be rejected."
        )
      )
    reason = rejection_in.reason.strip()
    if not reason:
      raise ValidationException(
        message = "A rejection reason is required."
      )
    requisition.status = (
      MaterialRequisitionStatus.REJECTED
    )
    requisition.rejection_reason = reason
    requisition.approved_by = None
    requisition.approved_at = None

    for item in requisition.items:
      item.approved_quantity = Decimal(
        "0.0000"
      )
    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  async def fulfill(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
    fulfillment_in: MaterialRequisitionFulfill,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )
    if requisition.status not in (
      MaterialRequisitionStatus.APPROVED,
      MaterialRequisitionStatus.PARTIALLY_FULFILLED,
    ):
      raise ValidationException(
        message=(
          "Only approved or partially "
          "fulfilled requisitions can "
          "receive fulfillment."
        )
      )
    item_map = {
      item.id: item
      for item in requisition.items
    }

    for fulfillment in fulfillment_in.items:
      item = item_map.get(
        fulfillment.item_id
      )
      if not item:
        raise NotFoundException(
          "Material requisition item"
        )
      new_quantity = (
        item.fulfilled_quantity
        + fulfillment.fulfilled_quantity
      )
      if new_quantity > item.approved_quantity:
        raise ValidationException(
          message=(
            f"Fulfilled quantity for "
            f"{item.item_code} cannot exceed "
            f"approved quantity."
          )
        )
      item.fulfilled_quantity = new_quantity
      
    all_fulfilled = all(
      item.fulfilled_quantity
      >= item.approved_quantity
      for item in requisition.items
      if item.approved_quantity > 0
    )
    has_fulfillment = any(
      item.fulfilled_quantity > 0
      for item in requisition.items
    )
    if all_fulfilled and has_fulfillment:
      requisition.status = (
        MaterialRequisitionStatus.FULFILLED
      )
    elif has_fulfillment:
      requisition.status = (
        MaterialRequisitionStatus.PARTIALLY_FULFILLED
      )
    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  async def cancel(
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
  ) -> MaterialRequisition:

    requisition = (
      await MaterialRequisitionService
      .get_requisition_or_404(
        db,
        requisition_id,
        organization_id,
      )
    )

    if requisition.status in (
      MaterialRequisitionStatus.FULFILLED,
      MaterialRequisitionStatus.CANCELLED,
    ):
      raise ValidationException(
        message=(
          "This requisition cannot "
          "be cancelled."
        )
      )
    requisition.status = (
      MaterialRequisitionStatus.CANCELLED
    )
    await db.commit()
    await db.refresh(requisition)
    return requisition

  @staticmethod
  def calculate_summary(
    requisition: MaterialRequisition,
  ) -> dict:

    requested = sum(
      (
        item.requested_quantity
        for item in requisition.items
      ),
      Decimal("0.0000"),
    )
    approved = sum(
      (
        item.approved_quantity
        for item in requisition.items
      ),
      Decimal("0.0000"),
    )
    fulfilled = sum(
      (
        item.fulfilled_quantity
        for item in requisition.items
      ),
      Decimal("0.0000"),
    )
    if approved <= 0:
      percentage = Decimal("0.00")
    else:
      percentage = (
        fulfilled
        / approved
        * Decimal("100")
      ).quantize(
        Decimal("0.01")
      )

    return {
      "requisition_id": requisition.id,
      "project_id": requisition.project_id,
      "status": requisition.status,
      "priority": requisition.priority,
      "total_items": len(requisition.items),
      "total_requested_quantity": requested,
      "total_approved_quantity": approved,
      "total_fulfilled_quantity": fulfilled,
      "fulfillment_percentage": percentage,
    }