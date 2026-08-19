from __future__ import annotations
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.identity.models import User
from app.core.exceptions import TameerException
import jwt
from uuid import UUID
from app.core.security import decode_token
from app.modules.identity.repository import UserRepository
from sqlalchemy import select
from app.modules.identity.models import Permission, Role, RolePermission, UserRole

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
  credentials: HTTPAuthorizationCredentials | None = Depends(
    bearer_scheme
  ),
  db: AsyncSession = Depends(get_db),
) -> User:

  if credentials is None:
    raise TameerException(
      code = "UNAUTHENTICATED",
      message = "Authentication is required.",
      status_code=401,
    )

  try:
    payload = decode_token(credentials.credentials)
  except jwt.PyJWTError:
    raise TameerException(
      code = "UNAUTHENTICATED",
      message = "Wrong or expired access token.",
      status_code=401,
    ) from None

  if payload.get("type") != "access":
    raise TameerException(
      code = "UNAUTHENTICATED",
      message = "wrong access token.",
      status_code=401,
    )

  subject = payload.get("sub")

  try:
    user_id = UUID(str(subject))
  except (TypeError, ValueError):
    raise TameerException(
      code = "UNAUTHENTICATED",
      message = "wrong access token subject.",
      status_code=401,
    ) from None

  user = await UserRepository(db).get_by_id(user_id)

  if user is None or not user.is_active:
    raise TameerException(
      code = "UNAUTHENTICATED",
      message = "User account is unavailable.",
      status_code=401,
    )

  return user

def require_permissions(required_codes: list[str]):
  async def dependency(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
  ) -> User:
    stmt = (
      select(Permission.code)
      .join(RolePermission, RolePermission.permission_id == Permission.id)
      .join(Role, Role.id == RolePermission.role_id)
      .join(UserRole, UserRole.role_id == Role.id)
      .where(UserRole.user_id == current_user.id, Permission.code.in_(required_codes))
    )
    result = await db.execute(stmt)
    found_permissions = result.scalars().all()
    if not found_permissions:
      raise TameerException(
        code = "FORBIDDEN",
        message = "You do not have the required permissions to perform this action.",
        status_code=403,
      )
    return current_user
  return dependency