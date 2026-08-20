from __future__ import annotations
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.auth import get_db
from app.dependencies.organization import get_current_organization_id, require_organization_permissions
from app.modules.budgets.permissions import Permissions
from app.modules.budgets.repository import budget_repo, budget_item_repo
from app.modules.budgets.schemas import BudgetCreate, BudgetItemCreate, BudgetItemOut, BudgetItemUpdate, BudgetOut, BudgetUpdate
from app.modules.budgets.service import BudgetService

router = APIRouter()

@router.post(
  "/projects/{project_id}",
  response_model=BudgetOut,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def create_budget(
  project_id: UUID,
  budget_in: BudgetCreate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.create_budget(
    db,
    budget_in,
    organization_id,
    project_id,
  )

@router.get(
  "/",
  response_model=list[BudgetOut],
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_VIEW]
      )
    )
  ],
)
async def get_budgets(
  skip: int = 0,
  limit: int = 100,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await budget_repo.get_by_org(
    db,
    organization_id,
    skip,
    limit,
  )

@router.get(
  "/projects/{project_id}",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_VIEW]
      )
    )
  ],
)
async def get_project_budget(
  project_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.get_project_budget_or_404(
    db,
    project_id,
    organization_id,
  )

@router.get(
  "/{budget_id}",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_VIEW]
      )
    )
  ],
)
async def get_budget(
  budget_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.get_budget_or_404(
    db,
    budget_id,
    organization_id,
  )

@router.patch(
  "/{budget_id}",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def update_budget(
  budget_id: UUID,
  budget_in: BudgetUpdate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.update_budget(
    db,
    budget_id,
    budget_in,
    organization_id,
  )

@router.delete(
  "/{budget_id}",
  status_code=status.HTTP_204_NO_CONTENT,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def delete_budget(
  budget_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await BudgetService.delete_budget(
    db,
    budget_id,
    organization_id,
  )

@router.post(
  "/{budget_id}/items",
  response_model=BudgetItemOut,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def create_budget_item(
  budget_id: UUID,
  item_in: BudgetItemCreate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.add_item(
    db,
    budget_id,
    item_in,
    organization_id,
  )


@router.get(
  "/{budget_id}/items",
  response_model=list[BudgetItemOut],
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_VIEW]
      )
    )
  ],
)
async def get_budget_items(
  budget_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await BudgetService.get_budget_or_404(
    db,
    budget_id,
    organization_id,
  )

  return await budget_item_repo.get_by_budget(
    db,
    budget_id,
  )

@router.patch(
  "/{budget_id}/items/{item_id}",
  response_model=BudgetItemOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def update_budget_item(
  budget_id: UUID,
  item_id: UUID,
  item_in: BudgetItemUpdate,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.update_item(
    db,
    budget_id,
    item_id,
    item_in,
    organization_id,
  )

@router.delete(
  "/{budget_id}/items/{item_id}",
  status_code=status.HTTP_204_NO_CONTENT,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def delete_budget_item(
  budget_id: UUID,
  item_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  await BudgetService.delete_item(
    db,
    budget_id,
    item_id,
    organization_id,
  )

@router.post(
  "/{budget_id}/submit",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_MANAGE]
      )
    )
  ],
)
async def submit_budget(
  budget_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.submit_for_approval(
    db,
    budget_id,
    organization_id,
  )

@router.post(
  "/{budget_id}/approve",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_APPROVE]
      )
    )
  ],
)
async def approve_budget(
  budget_id: UUID,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  current_user_id: UUID = Depends(...),
):
  return await BudgetService.approve_budget(
    db,
    budget_id,
    organization_id,
    current_user_id,
  )

@router.post(
  "/{budget_id}/reject",
  response_model=BudgetOut,
  dependencies=[
    Depends(
      require_organization_permissions(
        [Permissions.BUDGET_APPROVE]
      )
    )
  ],
)
async def reject_budget(
  budget_id: UUID,
  reason: str,
  db: AsyncSession = Depends(get_db),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
):
  return await BudgetService.reject_budget(
    db,
    budget_id,
    organization_id,
    reason,
  )