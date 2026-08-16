from __future__ import annotations
from app.core.config import get_settings
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
from app.modules.identity.repository import UserRepository, RoleRepository, RefreshTokenRepository
from app.modules.identity.schemas import RegisterRequest, LoginRequest, AuthResponse, RefreshRequest, TokenResponse, ResetPasswordRequest
from app.modules.identity.models import User, RefreshToken
from app.core.exceptions import TameerException
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, hash_refresh_token, create_password_reset_token, decode_password_reset_token
from datetime import datetime, timezone, timedelta
from sqlalchemy.exc import IntegrityError
from uuid import UUID
import jwt

settings = get_settings()

engine = create_async_engine(
  settings.database.async_url,
  echo=settings.app_debug,
  pool_pre_ping=True,
  pool_size=10,
  max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
  engine,
  class_=AsyncSession,
  expire_on_commit=False,
  autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
  async with AsyncSessionLocal() as session:
    try:
      yield session
    finally:
      await session.close()

MAX_FAILED_LOGIN_ATTEMPTS = 5
BASE_LOCKOUT_SECONDS = 30
MAX_LOCKOUT_SECONDS = 15 * 60

class IdentityService:

  def __init__(self, db: AsyncSession):
    self.db = db
    self.users = UserRepository(db)
    self.roles = RoleRepository(db)
    self.refresh_tokens = RefreshTokenRepository(db)

  async def register(
    self,
    data: RegisterRequest,
  ) -> User:
    email = str(data.email).lower().strip()
    existing = await self.users.get_by_email(email)

    if existing is not None:
      raise TameerException(
        code = "DUPLICATE_RESOURCE",
        message = "An account with this email already exists.",
        status_code=409,
      )

    user = User(
      email=email,
      password_hash=hash_password(data.password),
      first_name=data.first_name.strip(),
      last_name=data.last_name.strip(),
      password_changed_at=datetime.now(timezone.utc),
    )

    try:
      await self.users.create(user)
      await self.db.commit()
    except IntegrityError:
      await self.db.rollback()

      raise TameerException(
        code = "DUPLICATE_RESOURCE",
        message = "An account with this email already exists.",
        status_code=409,
      ) from None

    return user

  async def authenticate(
    self,
    data: LoginRequest,
    *,
    user_agent: str | None = None,
    ip_address: str | None = None,
  ) -> AuthResponse:
    email = str(data.email).lower().strip()

    user = await self.users.get_by_email(email)
    if user is None:
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Wrong email or password.",
        status_code=401,
      )
    now = datetime.now(timezone.utc)
    if user.locked_until and user.locked_until > now:
      raise TameerException(
        code = "RATE_LIMITED",
        message = "Account temporarily locked. Please try again later.",
        status_code=429,
      )
    if not verify_password(data.password, user.password_hash):
      await self._record_failed_login(user)
      await self.db.commit()
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Wrong email or password.",
        status_code=401,
      )

    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login_at = now

    access_token = create_access_token(
      user_id=str(user.id),
    )

    refresh_token = create_refresh_token()

    refresh_record = RefreshToken(
      user_id=user.id,
      token_hash=hash_refresh_token(refresh_token),
      expires_at=now + timedelta(
        days=settings.auth.refresh_token_expire_days
      ),
      user_agent=user_agent,
      ip_address=ip_address,
    )

    await self.refresh_tokens.create(refresh_record)
    await self.db.commit()

    return AuthResponse(
      user=user,
      access_token=access_token,
      refresh_token=refresh_token,
      expires_in=settings.auth.access_token_expire_minutes * 60,
    )
  async def refresh(
    self,
    data: RefreshRequest,
    *,
    user_agent: str | None = None,
    ip_address: str | None = None,
  ) -> TokenResponse:
    token_hash = hash_refresh_token(data.refresh_token)

    stored = await self.refresh_tokens.get_by_hash(token_hash)

    if stored is None:
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Wrong refresh token.",
        status_code=401,
      )

    now = datetime.now(timezone.utc)
    if stored.revoked_at is not None:
      await self.refresh_tokens.revoke_all_for_user(
        stored.user_id
      )
      await self.db.commit()
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Refresh token has already been revoked.",
        status_code=401,
      )

    if stored.expires_at <= now:
      await self.refresh_tokens.revoke(stored)
      await self.db.commit()
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Refresh token has expired.",
        status_code=401,
      )

    user = stored.user
    if user is None or not user.is_active:
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "User account is unavailable.",
        status_code=401,
      )

    new_refresh_token = create_refresh_token()
    replacement = RefreshToken(
      user_id=user.id,
      token_hash=hash_refresh_token(new_refresh_token),
      expires_at=now + timedelta(
        days=settings.auth.refresh_token_expire_days
      ),
      user_agent=user_agent,
      ip_address=ip_address,
    )
    await self.refresh_tokens.create(replacement)
    await self.refresh_tokens.revoke(
      stored,
      replaced_by_id=replacement.id,
    )
    access_token = create_access_token(
      user_id=str(user.id),
    )
    await self.db.commit()

    return TokenResponse(
      access_token=access_token,
      refresh_token=new_refresh_token,
      expires_in=settings.auth.access_token_expire_minutes * 60,
    )

  async def logout(
    self,
    data: RefreshRequest,
  ) -> None:
    token_hash = hash_refresh_token(data.refresh_token)
    stored = await self.refresh_tokens.get_by_hash(token_hash)
    if stored is None:
      return
    if stored.revoked_at is None:
      await self.refresh_tokens.revoke(stored)
      await self.db.commit()

  async def logout_all(
    self,
    user_id: UUID,
  ) -> None:
    await self.refresh_tokens.revoke_all_for_user(user_id)
    await self.db.commit()

  async def request_password_reset(
    self,
    email: str,
  ) -> str | None:
    user = await self.users.get_by_email(
      email.lower().strip()
    )
    if user is None or not user.is_active:
      return None
    token = create_password_reset_token(
      user_id=str(user.id),
    )
    return token

  async def reset_password(
    self,
    data: ResetPasswordRequest,
  ) -> None:
    try:
      payload = decode_password_reset_token(data.token)
    except jwt.PyJWTError:
      raise TameerException(
        code = "VALIDATION_ERROR",
        message = "Wrong or expired password reset token.",
        status_code=422,
      ) from None

    subject = payload.get("sub")
    try:
      user_id = UUID(str(subject))
    except (TypeError, ValueError):
      raise TameerException(
        code = "VALIDATION_ERROR",
        message = "Wrong password reset token.",
        status_code=422,
      ) from None

    user = await self.users.get_by_id(user_id)
    if user is None or not user.is_active:
      raise TameerException(
        code = "UNAUTHENTICATED",
        message = "Account is unavailable.",
        status_code=401,
      )

    user.password_hash = hash_password(
      data.new_password
    )
    user.password_changed_at = datetime.now(timezone.utc)
    user.failed_login_attempts = 0
    user.locked_until = None
    await self.refresh_tokens.revoke_all_for_user(user.id)
    await self.db.commit()

  async def _record_failed_login(
    self,
    user: User,
  ) -> None:
    user.failed_login_attempts += 1

    if user.failed_login_attempts < MAX_FAILED_LOGIN_ATTEMPTS:
      return
    exponent = user.failed_login_attempts - MAX_FAILED_LOGIN_ATTEMPTS

    lock_seconds = min(
      BASE_LOCKOUT_SECONDS * (2**exponent),
      MAX_LOCKOUT_SECONDS,
    )

    user.locked_until = (
      datetime.now(timezone.utc)
      + timedelta(seconds=lock_seconds)
    )