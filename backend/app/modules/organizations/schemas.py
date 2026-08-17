from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from uuid import UUID
from datetime import datetime

class OrganizationCreate(BaseModel):
  name: str = Field(
    min_length=2,
    max_length=160,
  )
  description: str | None = Field(
    default=None,
    max_length=2000,
  )
  logo_url: str | None = Field(
    default=None,
    max_length=500,
  )
  website: str | None = Field(
    default=None,
    max_length=500,
  )
  address: str | None = Field(
    default=None,
    max_length=500,
  )
  phone: str | None = Field(
    default=None,
    max_length=50,
  )
  email: EmailStr | None = None
  currency: str = Field(
    default = "PKR",
    min_length=3,
    max_length=3,
  )
  timezone: str = Field(
    default = "Asia/Karachi",
    min_length=1,
    max_length=100,
  )

class OrganizationUpdate(BaseModel):
  name: str | None = Field(
    default=None,
    min_length=2,
    max_length=160,
  )
  description: str | None = Field(
    default=None,
    max_length=2000,
  )
  logo_url: str | None = Field(
    default=None,
    max_length=500,
  )
  website: str | None = Field(
    default=None,
    max_length=500,
  )
  address: str | None = Field(
    default=None,
    max_length=500,
  )
  phone: str | None = Field(
    default=None,
    max_length=50,
  )
  email: EmailStr | None = None
  currency: str | None = Field(
    default=None,
    min_length=3,
    max_length=3,
  )
  timezone: str | None = Field(
    default=None,
    min_length=1,
    max_length=100,
  )

class OrganizationRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  name: str
  slug: str
  description: str | None
  logo_url: str | None
  website: str | None
  address: str | None
  phone: str | None
  email: str | None
  currency: str
  timezone: str
  is_active: bool
  created_at: datetime
  updated_at: datetime

class OrganizationSwitchRequest(BaseModel):
  organization_id: UUID

class UserSummary(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  email: str
  full_name: str
  avatar_url: str | None = None
  status: str

class PermissionRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  code: str
  name: str
  description: str | None = None
  domain: str

class RoleRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  name: str
  description: str | None = None
  is_system: bool
  is_active: bool
  permissions: list[PermissionRead] = []

class MembershipRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  user_id: UUID
  organization_id: UUID
  role_id: UUID
  joined_at: datetime
  is_default: bool
  user: UserSummary
  role: RoleRead

class InviteMemberRequest(BaseModel):
  email: EmailStr
  role_id: UUID
  full_name: str | None = Field(default=None, max_length=160,)