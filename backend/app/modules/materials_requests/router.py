from __future__ import annotations
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.auth import get_current_user, get_db
from app.dependencies.organization import get_current_organization_id, require_organization_permissions
from app.modules.materials_requests.permissions import Permissions
from app.modules.materials_requests.repository import material_requisition_item_repo, material_requisition_repo
from app.modules.materials_requests.schemas import (MaterialRequisitionApprove, MaterialRequisitionCreate, MaterialRequisitionFulfill, MaterialRequisitionItemCreate, MaterialRequisitionItemOut, MaterialRequisitionItemUpdate, MaterialRequisitionOut,
MaterialRequisitionReject, MaterialRequisitionSummary, MaterialRequisitionUpdate)
from app.modules.materials_requests.service import MaterialRequisitionService

router = APIRouter()

@router.post(
  "/projects/{project_id}",
  response_model=MaterialRequisitionOut,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_CREATE]
      )
    )
  ],
)
async def create_requisition(
  project_id: UUID,
  requisition_in: MaterialRequisitionCreate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  current_user_id: UUID = Depends(
    get_current_user
  ),
):
  return await (
    MaterialRequisitionService.create_requisition(
      db,
      requisition_in,
      organization_id,
      project_id,
      current_user_id,
    )
  )

@router.get(
  "/",
  response_model=list[MaterialRequisitionOut],
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_READ]
      )
    )
  ],
)
async def get_requisitions(
  skip: int = 0,
  limit: int = 100,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await material_requisition_repo.get_by_org(
    db,
    organization_id,
    skip,
    limit,
  )

@router.get(
  "/projects/{project_id}",
  response_model=list[MaterialRequisitionOut],
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_READ]
      )
    )
  ],
)
async def get_project_requisitions(
  project_id: UUID,
  skip: int = 0,
  limit: int = 100,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await material_requisition_repo.get_by_project_and_org(
    db,
    project_id,
    organization_id,
    skip,
    limit,
  )

@router.get(
  "/{requisition_id}",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_READ]
      )
    )
  ],
)
async def get_requisition(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await (
    MaterialRequisitionService
    .get_requisition_or_404(
      db,
      requisition_id,
      organization_id,
    )
  )

@router.patch(
  "/{requisition_id}",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_UPDATE]
      )
    )
  ],
)
async def update_requisition(
  requisition_id: UUID,
  requisition_in: MaterialRequisitionUpdate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await (
    MaterialRequisitionService.update_requisition(
      db,
      requisition_id,
      requisition_in,
      organization_id,
    )
  )

@router.delete(
  "/{requisition_id}",
  status_code=status.HTTP_204_NO_CONTENT,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_DELETE]
      )
    )
  ],
)
async def delete_requisition(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await (
    MaterialRequisitionService.delete_requisition(
      db,
      requisition_id,
      organization_id,
    )
  )

@router.post(
  "/{requisition_id}/items",
  response_model=MaterialRequisitionItemOut,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_UPDATE]
      )
    )
  ],
)
async def create_item(
  requisition_id: UUID,
  item_in: MaterialRequisitionItemCreate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.add_item(
    db,
    requisition_id,
    item_in,
    organization_id,
  )

@router.get(
  "/{requisition_id}/items",
  response_model=list[MaterialRequisitionItemOut],
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_READ]
      )
    )
  ],
)
async def get_items(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await (
    MaterialRequisitionService
    .get_requisition_or_404(
      db,
      requisition_id,
      organization_id,
    )
  )
  return await (
    material_requisition_item_repo
    .get_by_requisition(
      db,
      requisition_id,
    )
  )

@router.patch(
  "/{requisition_id}/items/{item_id}",
  response_model=MaterialRequisitionItemOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_UPDATE]
      )
    )
  ],
)
async def update_item(
  requisition_id: UUID,
  item_id: UUID,
  item_in: MaterialRequisitionItemUpdate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.update_item(
    db,
    requisition_id,
    item_id,
    item_in,
    organization_id,
  )

@router.delete(
  "/{requisition_id}/items/{item_id}",
  status_code=status.HTTP_204_NO_CONTENT,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_UPDATE]
      )
    )
  ],
)
async def delete_item(
  requisition_id: UUID,
  item_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await MaterialRequisitionService.delete_item(
    db,
    requisition_id,
    item_id,
    organization_id,
  )

@router.post(
  "/{requisition_id}/submit",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_SUBMIT]
      )
    )
  ],
)
async def submit_requisition(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.submit(
    db,
    requisition_id,
    organization_id,
  )

@router.post(
  "/{requisition_id}/approve",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_APPROVE]
      )
    )
  ],
)
async def approve_requisition(
  requisition_id: UUID,
  approval_in: MaterialRequisitionApprove,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  current_user_id: UUID = Depends(
    get_current_user
  ),
):
  return await MaterialRequisitionService.approve(
    db,
    requisition_id,
    organization_id,
    current_user_id,
    approval_in,
  )

@router.post(
  "/{requisition_id}/reject",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_REJECT]
      )
    )
  ],
)
async def reject_requisition(
  requisition_id: UUID,
  rejection_in: MaterialRequisitionReject,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.reject(
    db,
    requisition_id,
    organization_id,
    rejection_in,
  )

@router.post(
  "/{requisition_id}/fulfill",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_FULFILL]
      )
    )
  ],
)
async def fulfill_requisition(
  requisition_id: UUID,
  fulfillment_in: MaterialRequisitionFulfill,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.fulfill(
    db,
    requisition_id,
    organization_id,
    fulfillment_in,
  )

@router.post(
  "/{requisition_id}/cancel",
  response_model=MaterialRequisitionOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_CANCEL]
      )
    )
  ],
)
async def cancel_requisition(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await MaterialRequisitionService.cancel(
    db,
    requisition_id,
    organization_id,
  )

@router.get(
  "/{requisition_id}/summary",
  response_model=MaterialRequisitionSummary,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.MATERIAL_REQUISITION_READ]
      )
    )
  ],
)
async def get_summary(
  requisition_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  requisition = await (
    MaterialRequisitionService
    .get_requisition_or_404(
      db,
      requisition_id,
      organization_id,
    )
  )

  return MaterialRequisitionService.calculate_summary(
    requisition
  )