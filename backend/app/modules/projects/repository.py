from __future__ import annotations
from uuid import UUID
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.projects.models import Client, Project, Milestone, ProjectMember
from sqlalchemy.orm import selectinload

class BaseProjectRepository:
  async def update(
    self,
    db: AsyncSession,
    db_obj,
    obj_in: dict,
  ):
    for field, value in obj_in.items():
      if value is not None:
        setattr(db_obj, field, value)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def delete(
    self,
    db: AsyncSession,
    db_obj,
  ) -> None:
    await db.delete(db_obj)
    await db.commit()

class ClientRepository(BaseProjectRepository):
  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> Client:
    db_obj = Client(**obj_in)

    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_org(
    self,
    db: AsyncSession,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[Client]:

    stmt = (
      select(Client)
      .where(Client.organization_id == organization_id)
      .offset(skip)
      .limit(limit)
    )

    result = await db.execute(stmt)
    return list(result.scalars().all())

class ProjectRepository(BaseProjectRepository):

  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> Project:

    db_obj = Project(**obj_in)

    db.add(db_obj)

    await db.commit()
    await db.refresh(db_obj)

    return db_obj

  async def get_by_org(
    self,
    db: AsyncSession,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
) -> list[Project]:

    stmt = (
      select(Project)
      .options(
        selectinload(Project.milestones),
        selectinload(Project.members),
      )
      .where(Project.organization_id == organization_id)
      .offset(skip)
      .limit(limit)
    )

    result = await db.execute(stmt)
    return list(result.scalars().all())

  async def get_by_id_and_org(
    self,
    db: AsyncSession,
    project_id: str,
    organization_id: UUID,
) -> Project | None:

    stmt = (
      select(Project)
      .options(
        selectinload(Project.milestones),
        selectinload(Project.members),
      )
      .where(
        Project.id == project_id,
        Project.organization_id == organization_id,
      )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

class MilestoneRepository(BaseProjectRepository):
  async def create(
    self,
    db: AsyncSession,
    obj_in: dict,
  ) -> Milestone:

    db_obj = Milestone(**obj_in)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_project(
    self,
    db: AsyncSession,
    project_id: str,
  ) -> list[Milestone]:

    stmt = (
      select(Milestone)
      .where(Milestone.project_id == project_id)
    )

    result = await db.execute(stmt)
    return list(result.scalars().all())

  async def get_by_id(
    self,
    db: AsyncSession,
    milestone_id: str,
  ) -> Milestone | None:

    stmt = (
      select(Milestone)
      .where(Milestone.id == milestone_id)
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()

class ProjectMemberRepository(BaseProjectRepository):
  async def add_member(
    self,
    db: AsyncSession,
    project_id: str,
    user_id: UUID,
    role,
  ) -> ProjectMember:

    db_obj = ProjectMember(
      project_id=project_id,
      user_id=user_id,
      role=role,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

  async def get_by_project(
    self,
    db: AsyncSession,
    project_id: str,
  ) -> list[ProjectMember]:

    stmt = (
      select(ProjectMember)
      .where(ProjectMember.project_id == project_id)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

  async def get_by_project_and_user(
    self,
    db: AsyncSession,
    project_id: str,
    user_id: UUID,
  ) -> ProjectMember | None:

    stmt = (
      select(ProjectMember)
      .where(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id,
      )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

  async def remove_member(
    self,
    db: AsyncSession,
    project_id: str,
    user_id: UUID,
  ) -> None:

    stmt = (
      delete(ProjectMember)
      .where(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id,
      )
    )
    await db.execute(stmt)
    await db.commit()

client_repo = ClientRepository()
project_repo = ProjectRepository()
milestone_repo = MilestoneRepository()
member_repo = ProjectMemberRepository()