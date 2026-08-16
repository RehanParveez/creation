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