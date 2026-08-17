from __future__ import annotations
import re
import unicodedata
import uuid
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ForbiddenException, NotFoundException, TameerException, ValidationException
from app.modules.identity.models import Role, User
from app.modules.organizations.models import Organization, OrganizationMembership
from app.modules.organizations.repository import OrganizationRepository
from app.modules.organizations.schemas import InviteMemberRequest, OrganizationCreate, OrganizationUpdate

class OrganizationService:

  def __init__(self, db: AsyncSession) -> None:
    self.db = db
    self.repository = OrganizationRepository(db)

  @staticmethod
  def _slugify(value: str) -> str:
    normalized = unicodedata.normalize(
      "NFKD",
      value,
    ).encode(
      "ascii",
      "ignore",
    ).decode(
      "ascii",
    )

    slug = re.sub(
      r"[^a-zA-Z0-9]+",
      "-",
      normalized.lower(),
    ).strip("-")

    return slug or f"organization-{uuid.uuid4().hex[:8]}"

  async def _unique_slug(
    self,
    name: str,
  ) -> str:
    base = self._slugify(name)
    slug = base
    counter = 2
    while await self.repository.get_by_slug(slug):
      slug = f"{base}-{counter}"
      counter += 1
    return slug

  async def get_organization(
    self,
    organization_id: UUID,
  ) -> Organization:
    organization = await self.repository.get_by_id(
      organization_id,
    )
    if not organization:
      raise NotFoundException("Organization")
    return organization

  async def create_organization(
    self,
    user: User,
    data: OrganizationCreate,
  ) -> Organization:
    slug = await self._unique_slug(data.name)
    organization = Organization(
      name=data.name.strip(),
      slug=slug,
      description=data.description,
      logo_url=data.logo_url,
      website=data.website,
      address=data.address,
      phone=data.phone,
      email=(
        str(data.email).lower()
        if data.email
        else None
      ),
      currency=data.currency.upper(),
      timezone=data.timezone,
    )
    await self.repository.create_organization(
      organization,
    )

    company_admin = await self._get_company_admin_role()
    membership = OrganizationMembership(
      organization_id=organization.id,
      user_id=user.id,
      role_id=company_admin.id,
      is_default=True,
    )
    await self.repository.create_membership(
      membership,
    )
    await self.repository.commit()
    return organization

  async def _get_company_admin_role(self) -> Role:
    roles = await self.repository.list_roles()
    role = next(
      (
        item
        for item in roles
        if item.name.strip().lower()
        in {
          "company admin",
          "admin",
        }
        and item.is_system
      ),
      None,
    )
    if role is None:
      raise TameerException(
        code = "DEFAULT_ROLE_NOT_CONFIGURED",
        message=(
          "The Company Admin role is not configured. "
          "Seed the Identity roles before creating organizations."
        ),
        status_code=500,
      )

    return role

  async def list_my_organizations(
    self,
    user: User,
  ) -> list[Organization]:
    return await self.repository.list_for_user(
      user.id,
    )

  async def switch_organization(
    self,
    user: User,
    organization_id: UUID,
  ) -> Organization:
    organization = await self.get_organization(
      organization_id,
    )
    membership = await self.repository.get_membership(
      organization_id,
      user.id,
    )
    if membership is None:
      raise ForbiddenException("You are not a member of this organization.",
      )
    return organization

  async def update_organization(
    self,
    user: User,
    organization_id: UUID,
    data: OrganizationUpdate,
  ) -> Organization:
    organization = await self.get_organization(
      organization_id,
    )
    await self.require_membership(
      user,
      organization_id,
    )
    values = data.model_dump(
      exclude_unset=True,
    )
    if "name" in values and values["name"]:
      organization.name = values["name"].strip()
    if "description" in values:
      organization.description = values["description"]
    if "logo_url" in values:
      organization.logo_url = values["logo_url"]
    if "website" in values:
      organization.website = values["website"]
    if "address" in values:
      organization.address = values["address"]
    if "phone" in values:
      organization.phone = values["phone"]
    if "email" in values:
      organization.email = (
        str(values["email"]).lower()
        if values["email"]
        else None
      )
    if "currency" in values and values["currency"]:
      organization.currency = values["currency"].upper()
    if "timezone" in values and values["timezone"]:
      organization.timezone = values["timezone"]

    await self.repository.commit()
    await self.repository.refresh(organization)
    return organization

  async def require_membership(
    self,
    user: User,
    organization_id: UUID,
  ) -> OrganizationMembership:
    membership = await self.repository.get_membership(
      organization_id,
      user.id,
    )

    if membership is None:
      raise ForbiddenException("You are not a member of this organization.",
    )

    return membership

  async def list_members(
    self,
    user: User,
    organization_id: UUID,
  ) -> list[OrganizationMembership]:
    await self.require_membership(
      user,
      organization_id,
    )
    return await self.repository.list_members(
      organization_id,
    )

  async def invite_member(
    self,
    user: User,
    organization_id: UUID,
    data: InviteMemberRequest,
  ) -> OrganizationMembership:
    await self.require_membership(
      user,
      organization_id,
    )
    target_user = await self.repository.find_user_by_email(
      str(data.email).lower(),
    )
    if target_user is None:
      raise ValidationException(
        message=(
          "No registered user exists with this email. "
          "The user must create an account before being added "
          "to an organization."
        ),
      )
    if await self.repository.membership_exists(
      organization_id,
      target_user.id,
    ):
      raise ValidationException(
        message=("This user is already a member of the organization."
        ),
      )
    role = await self.repository.get_role(
      data.role_id,
    )
    if role is None:
      raise NotFoundException("Role")

    membership = OrganizationMembership(
      organization_id=organization_id,
      user_id=target_user.id,
      role_id=role.id,
      is_default=False,
    )
    await self.repository.create_membership(
      membership,
    )
    await self.repository.commit()
    refreshed = await self.repository.get_membership_by_id(
      membership.id,
    )

    if refreshed is None:
      raise NotFoundException("Membership")
    return refreshed

  async def list_roles(
    self,
    user: User,
    organization_id: UUID,
  ) -> list[Role]:
    await self.require_membership(
      user,
      organization_id,
    )
    return await self.repository.list_roles()

  async def list_permissions(self):
    return await self.repository.list_permissions()