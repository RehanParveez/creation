from __future__ import annotations
from app.core.config import get_settings
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Any
import jwt
import hashlib
import secrets

settings = get_settings()

def hash_password(password: str) -> str:
  return bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt(),
  ).decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
  try:
    return bcrypt.checkpw(
      password.encode("utf-8"),
      password_hash.encode("utf-8"),
    )
  except ValueError:
    return False

def create_access_token(
  *,
  user_id: str,
  expires_delta: timedelta | None = None,
  additional_claims: dict[str, Any] | None = None,
) -> str:
  now = datetime.now(timezone.utc)

  expires = now + (
    expires_delta
    or timedelta(minutes=settings.auth.access_token_expire_minutes)
  )

  payload: dict[str, Any] = {
    "sub": user_id,
    "type": "access",
    "iat": now,
    "exp": expires,
  }

  if additional_claims:
    payload.update(additional_claims)

  return jwt.encode(
    payload,
    settings.auth.secret_key,
    algorithm=settings.auth.algorithm,
  )

def decode_token(token: str) -> dict[str, Any]:
  return jwt.decode(
    token,
    settings.auth.secret_key,
    algorithms=[settings.auth.algorithm],
  )

def create_refresh_token() -> str:
  return secrets.token_urlsafe(64)

def hash_refresh_token(token: str) -> str:
  return hashlib.sha256(token.encode("utf-8")).hexdigest()

def create_password_reset_token(
  *,
  user_id: str,
  expires_delta: timedelta = timedelta(minutes=30),
) -> str:
  now = datetime.now(timezone.utc)

  payload = {
    "sub": user_id,
    "type": "password_reset",
    "iat": now,
    "exp": now + expires_delta,
    "jti": secrets.token_urlsafe(24),
  }

  return jwt.encode(
    payload,
    settings.auth.secret_key,
    algorithm=settings.auth.algorithm,
  )

def decode_password_reset_token(token: str) -> dict[str, Any]:
  payload = jwt.decode(
    token,
    settings.auth.secret_key,
    algorithms=[settings.auth.algorithm],
  )
  if payload.get("type") != "password_reset":
    raise jwt.InvalidTokenError("Invalid password reset token.")

  return payload