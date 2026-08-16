from __future__ import annotations
from app.modules.identity.models import User
from collections.abc import Callable
from fastapi import Depends
from app.core.exceptions import ForbiddenException
from app.dependencies.auth import get_current_user

IDENTITY_PERMISSIONS = {
  "user.view": "View user accounts.",
  "user.manage": "Manage user accounts.",
  "role.view": "View roles.",
  "role.manage": "Manage roles.",
  "permission.view": "View permissions.",
}

def get_user_permission_codes(user: User) -> set[str]:
  return {
    permission.code
    for role in user.roles
    for permission in role.permissions
  }

def user_has_permission(
  user: User,
  permission: str,
) -> bool:
  return permission in get_user_permission_codes(user)

def permission_checker(
  permission: str,
) -> Callable:

  async def dependency(
    current_user: User = Depends(get_current_user),
  ) -> User:
    if not user_has_permission(current_user, permission):
      raise ForbiddenException(
        f"Permission required: {permission}."
      )
    return current_user

  dependency.__name__ = (
    f"require_{permission.replace('.', '_')}"
  )
  return dependency

def require_permission(permission: str) -> Callable:
  return permission_checker(permission)