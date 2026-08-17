from __future__ import annotations
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.modules.identity.models import Permission, Role, User
from app.modules.organizations.models import Organization, OrganizationMembership

class OrganizationRepository:
  
  def __init__(self, db: AsyncSession) -> None:
    self.db = db

  async def get_by_id(
    self,
    organization_id: UUID,
  ) -> Organization | None:
    result = await self.db.execute(
      select(Organization).where(
        Organization.id == organization_id,
        Organization.is_active.is_(True),
      )
    )
    return result.scalar_one_or_none()

  async def get_by_slug(
    self,
    slug: str,
  ) -> Organization | None:
    result = await self.db.execute(
      select(Organization).where(
        Organization.slug == slug,
      )
    )
    return result.scalar_one_or_none()

  async def list_for_user(
    self,
    user_id: UUID,
  ) -> list[Organization]:
    result = await self.db.execute(
      select(Organization)
      .join(
        OrganizationMembership,
        OrganizationMembership.organization_id
        == Organization.id,
      )
      .where(
        OrganizationMembership.user_id == user_id,
        Organization.is_active.is_(True),
      )
      .order_by(Organization.name.asc())
    )
    return list(result.scalars().unique().all())

  async def get_membership(
    self,
    organization_id: UUID,
    user_id: UUID,
  ) -> OrganizationMembership | None:
    result = await self.db.execute(
      select(OrganizationMembership)
      .options(
        selectinload(OrganizationMembership.user),
        selectinload(OrganizationMembership.role)
        .selectinload(Role.permissions),
      )
      .where(
        OrganizationMembership.organization_id
        == organization_id,
        OrganizationMembership.user_id == user_id,
      )
    )

    return result.scalar_one_or_none()

  async def get_membership_by_id(
    self,
    membership_id: UUID,
  ) -> OrganizationMembership | None:
    result = await self.db.execute(
      select(OrganizationMembership)
      .options(
        selectinload(OrganizationMembership.user),
        selectinload(OrganizationMembership.role)
        .selectinload(Role.permissions),
      )
      .where(
        OrganizationMembership.id == membership_id,
      )
    )
    return result.scalar_one_or_none()

  async def list_members(
    self,
    organization_id: UUID,
  ) -> list[OrganizationMembership]:
    result = await self.db.execute(
      select(OrganizationMembership)
      .options(
        selectinload(OrganizationMembership.user),
        selectinload(OrganizationMembership.role)
        .selectinload(Role.permissions),
      )
      .where(
        OrganizationMembership.organization_id
        == organization_id,
      )
      .order_by(
        OrganizationMembership.joined_at.asc(),
      )
    )
    return list(result.scalars().unique().all())

  async def find_user_by_email(
    self,
    email: str,
  ) -> User | None:
    result = await self.db.execute(
      select(User).where(
        User.email == email.lower(),
      )
    )
    return result.scalar_one_or_none()

  async def membership_exists(
    self,
    organization_id: UUID,
    user_id: UUID,
  ) -> bool:
    result = await self.db.execute(
      select(OrganizationMembership.id).where(
        OrganizationMembership.organization_id
        == organization_id,
        OrganizationMembership.user_id == user_id,
      )
    )
    return result.scalar_one_or_none() is not None

  async def get_role(
    self,
    role_id: UUID,
  ) -> Role | None:
    result = await self.db.execute(
      select(Role)
      .options(
        selectinload(Role.permissions),
      )
      .where(
        Role.id == role_id,
        Role.is_active.is_(True),
      )
    )
    return result.scalar_one_or_none()

  async def list_roles(self) -> list[Role]:
    result = await self.db.execute(
      select(Role)
      .options(
        selectinload(Role.permissions),
      )
      .where(
        Role.is_active.is_(True),
      )
      .order_by(Role.name.asc())
    )
    return list(result.scalars().unique().all())

  async def list_permissions(self) -> list[Permission]:
    result = await self.db.execute(
      select(Permission)
      .where(
        Permission.is_active.is_(True),
      )
      .order_by(
        Permission.domain.asc(),
        Permission.code.asc(),
      )
    )
    return list(result.scalars().all())

  async def create_organization(
    self,
    organization: Organization,
  ) -> Organization:
    self.db.add(organization)
    await self.db.flush()
    return organization

  async def create_membership(
    self,
    membership: OrganizationMembership,
  ) -> OrganizationMembership:
    self.db.add(membership)
    await self.db.flush()
    return membership

  async def commit(self) -> None:
    await self.db.commit()

  async def refresh(
    self,
    entity: object,
  ) -> None:
    await self.db.refresh(entity)