from app.modules.identity.models import User, Permission, RolePermission, Role
from fastapi import Depends
from app.dependencies.auth import get_current_user, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlalchemy import select
from app.modules.organizations.models import OrganizationMembership
from app.core.exceptions import ForbiddenException, TameerException

async def get_current_organization_id(
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db),
) -> UUID:
  stmt = (
    select(OrganizationMembership.organization_id)
    .where(
      OrganizationMembership.user_id == current_user.id,
      OrganizationMembership.is_default.is_(True),
    )
    .limit(1)
  )
  result = await db.execute(stmt)
  organization_id = result.scalar_one_or_none()
  if organization_id is None:
    raise ForbiddenException(
      "You are not a member of an organization."
    )
  return organization_id

def require_organization_permissions(
  required_codes: list[str],
):
    
  async def dependency(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    organization_id: UUID = Depends(
      get_current_organization_id
    ),
  ) -> User:
    stmt = (
      select(Permission.code)
      .join(
        RolePermission,
        RolePermission.permission_id == Permission.id,
      )
      .join(
        Role,
        Role.id == RolePermission.role_id,
      )
      .join(
        OrganizationMembership,
        OrganizationMembership.role_id == Role.id,
      )
      .where(
        OrganizationMembership.user_id == current_user.id,
        OrganizationMembership.organization_id == organization_id,
        Permission.code.in_(required_codes),
      )
    )
    result = await db.execute(stmt)
    found_permissions = result.scalars().all()
    if not found_permissions:
      raise TameerException(
        code="FORBIDDEN",
        message=(
          "You do not have the required permissions "
          "for this organization."
        ),
        status_code=403,
      )
    return current_user
  return dependency