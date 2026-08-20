from __future__ import annotations
from app.modules.budgets.models import Budget, BudgetItem
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from uuid import UUID

class BaseBudgetRepository:
  async def update(
    self,
    db: AsyncSession,
    db_obj,
    obj_in: dict,
  ):
    for field, value in obj_in.items():
      if value is not None:
        setattr(db_obj, field, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def delete(
    self,
    db: AsyncSession,
    db_obj,
  ) -> None:
    await db.delete(db_obj)
    await db.commit()

class BudgetRepository(BaseBudgetRepository):
  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> Budget:

    db_obj = Budget(**obj_in)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_id_and_org(
    self,
    db: AsyncSession,
    budget_id: UUID,
    organization_id: UUID,
  ) -> Budget | None:

    stmt = (
      select(Budget)
      .options(
        selectinload(Budget.items)
      )
      .where(
        Budget.id == budget_id,
        Budget.organization_id == organization_id,
      )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_project_and_org(
    self,
    db: AsyncSession,
    project_id: UUID,
    organization_id: UUID,
  ) -> Budget | None:

    stmt = (
      select(Budget)
      .options(
        selectinload(Budget.items)
      )
      .where(
        Budget.project_id == project_id,
        Budget.organization_id == organization_id,
      )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_org(
    self,
    db: AsyncSession,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[Budget]:

    stmt = (
      select(Budget)
      .options(
        selectinload(Budget.items)
      )
      .where(
        Budget.organization_id == organization_id
      )
      .order_by(Budget.created_at.desc())
      .offset(skip)
      .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().unique().all())

class BudgetItemRepository(BaseBudgetRepository):
  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> BudgetItem:

    db_obj = BudgetItem(**obj_in)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_id(
    self,
    db: AsyncSession,
    item_id: UUID,
  ) -> BudgetItem | None:

    stmt = (
      select(BudgetItem)
      .where(BudgetItem.id == item_id)
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_id_and_budget(
    self,
    db: AsyncSession,
    item_id: UUID,
    budget_id: UUID,
  ) -> BudgetItem | None:

    stmt = (
      select(BudgetItem)
      .where(
        BudgetItem.id == item_id,
        BudgetItem.budget_id == budget_id,
      )
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_budget(
    self,
    db: AsyncSession,
    budget_id: UUID,
  ) -> list[BudgetItem]:

    stmt = (
      select(BudgetItem)
      .where(
        BudgetItem.budget_id == budget_id
      )
      .order_by(BudgetItem.item_code)
    )

    result = await db.execute(stmt)

    return list(result.scalars().all())

budget_repo = BudgetRepository()
budget_item_repo = BudgetItemRepository()