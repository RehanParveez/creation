from __future__ import annotations
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.identity.models import User, Permission, RefreshToken, Role
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from uuid import UUID

class UserRepository:

  def __init__(self, session: AsyncSession):
    self.session = session

  async def get_by_id(self, user_id: UUID) -> User | None:
    result = await self.session.execute(
      select(User)
      .where(User.id == user_id)
      .options(selectinload(User.roles).selectinload(Role.permissions))
    )
    return result.scalar_one_or_none()

  async def get_by_email(self, email: str) -> User | None:
    result = await self.session.execute(
      select(User)
      .where(User.email == email.lower().strip())
      .options(selectinload(User.roles).selectinload(Role.permissions))
    )
    return result.scalar_one_or_none()

  async def create(self, user: User) -> User:
    self.session.add(user)
    await self.session.flush()
    return user

  async def update(self, user: User) -> User:
    self.session.add(user)
    await self.session.flush()
    return user

class RoleRepository:

  def __init__(self, session: AsyncSession):
    self.session = session

  async def get_by_id(self, role_id: UUID) -> Role | None:
    result = await self.session.execute(
      select(Role)
      .where(Role.id == role_id)
      .options(selectinload(Role.permissions))
    )
    return result.scalar_one_or_none()

  async def get_by_name(self, name: str) -> Role | None:
    result = await self.session.execute(
      select(Role)
      .where(Role.name == name)
      .options(selectinload(Role.permissions))
    )
    return result.scalar_one_or_none()

  async def list(self) -> list[Role]:
    result = await self.session.execute(
      select(Role)
      .options(selectinload(Role.permissions))
      .order_by(Role.name)
    )
    return list(result.scalars().unique().all())

class PermissionRepository:
 
  def __init__(self, session: AsyncSession):
    self.session = session

  async def get_by_code(self, code: str) -> Permission | None:
    result = await self.session.execute(
      select(Permission).where(Permission.code == code)
    )
    return result.scalar_one_or_none()

  async def list(self) -> list[Permission]:
    result = await self.session.execute(
      select(Permission).order_by(Permission.code)
    )
    return list(result.scalars().all())

class RefreshTokenRepository:

  def __init__(self, session: AsyncSession):
    self.session = session

  async def get_by_hash(self, token_hash: str) -> RefreshToken | None:
    result = await self.session.execute(
      select(RefreshToken)
      .where(RefreshToken.token_hash == token_hash)
      .options(selectinload(RefreshToken.user))
    )
    return result.scalar_one_or_none()

  async def create(self, token: RefreshToken) -> RefreshToken:
    self.session.add(token)
    await self.session.flush()
    return token

  async def revoke(
    self,
    token: RefreshToken,
    *,
    replaced_by_id: UUID | None = None,
  ) -> RefreshToken:
    token.revoked_at = datetime.now(timezone.utc)
    token.replaced_by_id = replaced_by_id
    self.session.add(token)
    await self.session.flush()
    return token

  async def revoke_all_for_user(self, user_id: UUID) -> None:
    result = await self.session.execute(
      select(RefreshToken).where(
        RefreshToken.user_id == user_id,
        RefreshToken.revoked_at.is_(None),
      )
    )
    tokens = result.scalars().all()
    now = datetime.now(timezone.utc)

    for token in tokens:
      token.revoked_at = now
      self.session.add(token)

    await self.session.flush()