from __future__ import annotations
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ConflictException, NotFoundException, ValidationException
from app.modules.budgets.models import Budget, BudgetItem, BudgetStatus
from app.modules.budgets.repository import budget_repo, budget_item_repo
from app.modules.budgets.schemas import BudgetCreate, BudgetItemCreate, BudgetItemUpdate, BudgetUpdate

class BudgetService:

  @staticmethod
  async def create_budget(
    db: AsyncSession,
    budget_in: BudgetCreate,
    organization_id: UUID,
    project_id: UUID,
  ) -> Budget:

    existing = await budget_repo.get_by_project_and_org(
      db,
      project_id,
      organization_id,
    )

    if existing:
      raise ConflictException(
        message="A budget already exists for this project."
      )

    data = budget_in.model_dump()

    data["organization_id"] = organization_id
    data["project_id"] = project_id
    data["status"] = BudgetStatus.DRAFT

    return await budget_repo.create(
      db,
      data,
    )

  @staticmethod
  async def get_budget_or_404(
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
  ) -> Budget:

    budget = await budget_repo.get_by_id_and_org(
      db,
      budget_id,
      organization_id,
    )

    if not budget:
      raise NotFoundException("Budget")

    return budget

  @staticmethod
  async def get_project_budget_or_404(
    db: AsyncSession,
    project_id: UUID,
    organization_id: UUID,
  ) -> Budget:

    budget = await budget_repo.get_by_project_and_org(
      db,
      project_id,
      organization_id,
    )

    if not budget:
      raise NotFoundException(
        "Budget for project"
      )

    return budget

  @staticmethod
  async def update_budget(
    db: AsyncSession,
    budget_id: UUID,
    budget_in: BudgetUpdate,
    organization_id: UUID,
  ) -> Budget:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )

    BudgetService._ensure_editable(budget)

    data = budget_in.model_dump(
      exclude_unset=True
    )

    for field, value in data.items():
      setattr(budget, field, value)

    await db.commit()
    await db.refresh(budget)

    return budget

  @staticmethod
  async def delete_budget(
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
  ) -> None:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )

    BudgetService._ensure_editable(budget)
    await budget_repo.delete(
      db,
      budget,
    )

  @staticmethod
  async def add_item(
    db: AsyncSession,
    budget_id: UUID,
    item_in: BudgetItemCreate,
    organization_id: UUID,
  ) -> BudgetItem:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )
    BudgetService._ensure_editable(budget)
    existing_items = await budget_item_repo.get_by_budget(
      db,
      budget.id,
    )
    if any(
      item.item_code == item_in.item_code
      for item in existing_items
    ):
      raise ConflictException(
        message="An item with this item code already exists in the budget."
      )
    total = BudgetService.calculate_item_total(
      item_in.planned_quantity,
      item_in.estimated_unit_cost,
    )

    data = item_in.model_dump()
    data["budget_id"] = budget.id
    data["estimated_total_cost"] = total
    data["actual_cost"] = Decimal("0.00")
    return await budget_item_repo.create(
      db,
      data,
    )

  @staticmethod
  async def update_item(
    db: AsyncSession,
    budget_id: UUID,
    item_id: UUID,
    item_in: BudgetItemUpdate,
    organization_id: UUID,
  ) -> BudgetItem:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )
    BudgetService._ensure_editable(budget)
    item = await budget_item_repo.get_by_id_and_budget(
      db,
      item_id,
      budget_id,
    )
    if not item:
      raise NotFoundException(
        "Budget item"
      )
    data = item_in.model_dump(
      exclude_unset=True
    )
    for field, value in data.items():
      if value is not None:
        setattr(item, field, value)
    item.estimated_total_cost = (
      item.planned_quantity
      * item.estimated_unit_cost
    ).quantize(
      Decimal("0.01")
    )
    await db.commit()
    await db.refresh(item)

    return item

  @staticmethod
  async def delete_item(
    db: AsyncSession,
    budget_id: UUID,
    item_id: UUID,
    organization_id: UUID,
  ) -> None:
    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )
    BudgetService._ensure_editable(budget)

    item = await budget_item_repo.get_by_id_and_budget(
      db,
      item_id,
      budget_id,
    )
    if not item:
      raise NotFoundException(
        "Budget item"
      )
    await budget_item_repo.delete(
      db,
      item,
    )
    
  @staticmethod
  async def submit_for_approval(
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
  ) -> Budget:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )
    if budget.status not in (
      BudgetStatus.DRAFT,
      BudgetStatus.REJECTED,
    ):
      raise ValidationException(
        message=(
          "Only draft or rejected budgets "
          "can be submitted for approval."
        )
      )
    if not budget.items:
      raise ValidationException(
        message=(
          "A budget must contain at least "
          "one budget item before approval."
        )
      )
    budget.status = BudgetStatus.PENDING_APPROVAL
    budget.rejection_reason = None
    await db.commit()
    await db.refresh(budget)
    return budget

  @staticmethod
  async def approve_budget(
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
    approver_id: UUID,
  ) -> Budget:
    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )
    if budget.status != BudgetStatus.PENDING_APPROVAL:
      raise ValidationException(
        message=(
          "Only budgets pending approval "
          "can be approved."
        )
      )
    budget.status = BudgetStatus.APPROVED
    budget.approved_by = approver_id
    budget.approved_at = datetime.now(timezone.utc)
    budget.rejection_reason = None
    await db.commit()
    await db.refresh(budget)
    return budget

  @staticmethod
  async def reject_budget(
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
    reason: str,
  ) -> Budget:

    budget = await BudgetService.get_budget_or_404(
      db,
      budget_id,
      organization_id,
    )

    if budget.status != BudgetStatus.PENDING_APPROVAL:
      raise ValidationException(
        message=(
          "Only budgets pending approval "
          "can be rejected."
        )
      )
    if not reason.strip():
      raise ValidationException(
        message="A rejection reason is required."
      )
    budget.status = BudgetStatus.REJECTED
    budget.rejection_reason = reason
    budget.approved_by = None
    budget.approved_at = None
    await db.commit()
    await db.refresh(budget)
    return budget

  @staticmethod
  def calculate_item_total(
    quantity: Decimal,
    unit_cost: Decimal,
  ) -> Decimal:

    return (
      quantity * unit_cost
    ).quantize(
      Decimal("0.01")
    )

  @staticmethod
  def calculate_estimated_budget(
    items: list[BudgetItem],
  ) -> Decimal:

    return sum(
      (
        item.estimated_total_cost
        for item in items
      ),
      Decimal("0.00"),
    ).quantize(
      Decimal("0.01")
    )

  @staticmethod
  def calculate_actual_cost(
    items: list[BudgetItem],
  ) -> Decimal:

    return sum(
      (
        item.actual_cost
        for item in items
      ),
      Decimal("0.00"),
    ).quantize(
      Decimal("0.01")
    )

  @staticmethod
  def calculate_remaining_budget(
    approved_budget: Decimal,
    actual_expense: Decimal,
    committed_cost: Decimal,
  ) -> Decimal:

    return (
      approved_budget
      - actual_expense
      - committed_cost
    ).quantize(
      Decimal("0.01")
    )

  @staticmethod
  def calculate_usage_percentage(
    approved_budget: Decimal,
    actual_expense: Decimal,
    committed_cost: Decimal,
  ) -> Decimal:

    if approved_budget <= Decimal("0.00"):
      return Decimal("0.00")

    return (
      (
        actual_expense
        + committed_cost
      )
      / approved_budget
      * Decimal("100")
    ).quantize(
      Decimal("0.01")
    )

  @staticmethod
  def _ensure_editable(
    budget: Budget,
  ) -> None:

    if budget.status not in (
      BudgetStatus.DRAFT,
      BudgetStatus.REJECTED,
    ):
      raise ValidationException(
        message=(
          "This budget cannot be modified "
          "in its current state."
        )
      )