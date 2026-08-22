from __future__ import annotations
from uuid import UUID
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.modules.materials_requests.models import MaterialRequisition, MaterialRequisitionItem

class BaseMaterialRequisitionRepository:

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

class MaterialRequisitionRepository(
  BaseMaterialRequisitionRepository
):

  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> MaterialRequisition:

    db_obj = MaterialRequisition(**obj_in)

    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_id_and_org(
    self,
    db: AsyncSession,
    requisition_id: UUID,
    organization_id: UUID,
  ) -> MaterialRequisition | None:

    stmt = (
      select(MaterialRequisition)
      .options(
        selectinload(
          MaterialRequisition.items
        )
      )
      .where(
        MaterialRequisition.id == requisition_id,
        MaterialRequisition.organization_id
        == organization_id,
      )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_project_and_org(
    self,
    db: AsyncSession,
    project_id: UUID,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[MaterialRequisition]:

    stmt = (
      select(MaterialRequisition)
      .options(
        selectinload(
          MaterialRequisition.items
        )
      )
      .where(
        MaterialRequisition.project_id == project_id,
        MaterialRequisition.organization_id
        == organization_id,
      )
      .order_by(
        MaterialRequisition.created_at.desc()
      )
      .offset(skip)
      .limit(limit)
    )
    result = await db.execute(stmt)
    return list(
      result.scalars().unique().all()
    )

  async def get_by_org(
    self,
    db: AsyncSession,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[MaterialRequisition]:

    stmt = (
      select(MaterialRequisition)
      .options(
        selectinload(
          MaterialRequisition.items
        )
      )
      .where(
        MaterialRequisition.organization_id
        == organization_id
      )
      .order_by(
        MaterialRequisition.created_at.desc()
      )
      .offset(skip)
      .limit(limit)
    )
    result = await db.execute(stmt)
    return list(
      result.scalars().unique().all()
    )

class MaterialRequisitionItemRepository(
  BaseMaterialRequisitionRepository
):

  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> MaterialRequisitionItem:

    db_obj = MaterialRequisitionItem(**obj_in)
    db.add(db_obj)

    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_id(
    self,
    db: AsyncSession,
    item_id: UUID,
  ) -> MaterialRequisitionItem | None:

    stmt = select(
      MaterialRequisitionItem
    ).where(
      MaterialRequisitionItem.id == item_id
    )

    result = await db.execute(stmt)

    return result.scalar_one_or_none()

  async def get_by_id_and_requisition(
    self,
    db: AsyncSession,
    item_id: UUID,
    requisition_id: UUID,
  ) -> MaterialRequisitionItem | None:

    stmt = select(
      MaterialRequisitionItem
    ).where(
      MaterialRequisitionItem.id == item_id,
      MaterialRequisitionItem.requisition_id
      == requisition_id,
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def get_by_requisition(
    self,
    db: AsyncSession,
    requisition_id: UUID,
  ) -> list[MaterialRequisitionItem]:

    stmt = (
      select(MaterialRequisitionItem)
      .where(
        MaterialRequisitionItem.requisition_id
        == requisition_id
      )
      .order_by(
        MaterialRequisitionItem.item_code
      )
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

  async def remove_member(
    self,
    db: AsyncSession,
    requisition_id: UUID,
    item_id: UUID,
  ) -> None:

    stmt = delete(
      MaterialRequisitionItem
    ).where(
      MaterialRequisitionItem.id == item_id,
      MaterialRequisitionItem.requisition_id
      == requisition_id,
    )
    await db.execute(stmt)
    await db.commit()

material_requisition_repo = (
  MaterialRequisitionRepository()
)
material_requisition_item_repo = (
  MaterialRequisitionItemRepository()
)