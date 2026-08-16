from __future__ import annotations
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from datetime import datetime
from uuid import UUID

class RegisterRequest(BaseModel):
  email: EmailStr
  password: str = Field(min_length=8, max_length=128)
  first_name: str = Field(min_length=1, max_length=100)
  last_name: str = Field(min_length=1, max_length=100)

  @field_validator("password")
  @classmethod
  def validate_password(cls, value: str) -> str:
    if not any(char.isupper() for char in value):
      raise ValueError("Password must contain at least one uppercase letter.")
    if not any(char.islower() for char in value):
      raise ValueError("Password must contain at least one lowercase letter.")
    if not any(char.isdigit() for char in value):
      raise ValueError("Password must contain at least one number.")

    return value

class LoginRequest(BaseModel):
  email: EmailStr
  password: str = Field(min_length=1, max_length=128)

class RefreshRequest(BaseModel):
  refresh_token: str = Field(min_length=20)

class LogoutRequest(BaseModel):
  refresh_token: str = Field(min_length=20)

class ForgotPasswordRequest(BaseModel):
  email: EmailStr

class ResetPasswordRequest(BaseModel):
  token: str = Field(min_length=20)
  new_password: str = Field(min_length=8, max_length=128)

  @field_validator("new_password")
  @classmethod
  def validate_password(cls, value: str) -> str:
    if not any(char.isupper() for char in value):
      raise ValueError("Password must contain at least one uppercase letter.")
    if not any(char.islower() for char in value):
      raise ValueError("Password must contain at least one lowercase letter.")
    if not any(char.isdigit() for char in value):
      raise ValueError("Password must contain at least one number.")

    return value

class PermissionResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  code: str
  description: str | None = None

class RoleResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  name: str
  description: str | None = None
  is_system: bool
  permissions: list[PermissionResponse] = []

class UserResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)
  id: UUID
  email: EmailStr
  first_name: str
  last_name: str
  is_active: bool
  is_verified: bool
  last_login_at: datetime | None = None

  @property
  def full_name(self) -> str:
    return f"{self.first_name} {self.last_name}".strip()

class TokenResponse(BaseModel):
  access_token: str
  refresh_token: str
  token_type: str = "bearer"
  expires_in: int

class AuthResponse(BaseModel):
  user: UserResponse
  access_token: str
  refresh_token: str
  token_type: str = "bearer"
  expires_in: int

class MessageResponse(BaseModel):
  message: str

class MeResponse(UserResponse):
  permissions: list[str] = []
  roles: list[str] = []