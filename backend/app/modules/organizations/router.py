from __future__ import annotations
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.deps import get_db
from app.modules.identity.models import User
from app.dependencies.auth import get_current_user
from app.modules.organizations.schemas import InviteMemberRequest, MembershipRead, OrganizationCreate, OrganizationRead, OrganizationSwitchRequest, OrganizationUpdate, PermissionRead, RoleRead
from app.modules.organizations.service import OrganizationService

router = APIRouter(
  prefix = "/organizations",
  tags = ["organizations"],
)

@router.post(
  "",
  response_model=OrganizationRead,
  status_code=status.HTTP_201_CREATED,
)

async def create_organization(
  payload: OrganizationCreate,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)
  return await service.create_organization(
    current_user,
    payload,
  )

@router.get(
  "/my",
  response_model=list[OrganizationRead],
)
async def get_my_organizations(
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)

  return await service.list_my_organizations(
    current_user,
  )

@router.get(
  "/permissions/all",
  response_model=list[PermissionRead],
)
async def get_all_permissions(
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)
  return await service.list_all_permissions()

@router.post(
  "/switch",
  response_model=OrganizationRead,
)
async def switch_organization(
  payload: OrganizationSwitchRequest,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)

  return await service.switch_organization(
    current_user,
    payload.organization_id,
  )

@router.get(
  "/{organization_id}",
  response_model=OrganizationRead,
)
async def get_organization(
  organization_id: UUID,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)
  await service.require_membership(
    current_user,
    organization_id,
  )
  return await service.get_organization(
    organization_id,
  )

@router.patch(
  "/{organization_id}",
  response_model=OrganizationRead,
)
async def update_organization(
  organization_id: UUID,
  payload: OrganizationUpdate,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)

  return await service.update_organization(
    current_user,
    organization_id,
    payload,
  )

@router.get(
  "/{organization_id}/members",
  response_model=list[MembershipRead],
)

async def get_members(
  organization_id: UUID,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)

  return await service.list_members(
    current_user,
    organization_id,
  )

@router.post(
  "/{organization_id}/invite",
  response_model=MembershipRead,
  status_code=status.HTTP_201_CREATED,
)

async def invite_member(
  organization_id: UUID,
  payload: InviteMemberRequest,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)
  return await service.invite_member(
    current_user,
    organization_id,
    payload,
  )

@router.get(
  "/{organization_id}/roles",
  response_model=list[RoleRead],
)
async def get_roles(
  organization_id: UUID,
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
):
  service = OrganizationService(db)

  return await service.list_roles(
    current_user,
    organization_id,
  )