from __future__ import annotations
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException, ValidationException
from app.modules.projects.repository import client_repo, project_repo, milestone_repo, member_repo
from app.modules.projects.schemas import ClientCreate, ProjectCreate, MilestoneCreate, ProjectMemberCreate
class ProjectService:

  @staticmethod
  async def create_client(
    db: AsyncSession,
    client_in: ClientCreate,
    organization_id: UUID,
  ):
    data = client_in.model_dump()
    data["organization_id"] = organization_id
    return await client_repo.create(
      db,
      obj_in=data,
    )

  @staticmethod
  async def create_project(
    db: AsyncSession,
    project_in: ProjectCreate,
    organization_id: UUID,
  ):
    data = project_in.model_dump()

    if data.get("client_id"):
      client = await client_repo.get_by_id_and_org(
        db,
        data["client_id"],
        organization_id,
      )
      if not client:
        raise NotFoundException(
          "Client"
        )

    data["organization_id"] = organization_id
    return await project_repo.create(
      db,
      obj_in=data,
    )

  @staticmethod
  async def get_project_or_404(
    db: AsyncSession,
    project_id: str,
    organization_id: UUID,
  ):

    project = await project_repo.get_by_id_and_org(
      db,
      project_id,
      organization_id,
    )
    if not project:
      raise NotFoundException(
        "Project"
      )
    return project

  @staticmethod
  async def delete_project(
    db: AsyncSession,
    project_id: str,
    organization_id: UUID,
  ):
    project = await ProjectService.get_project_or_404(
      db,
      project_id,
      organization_id,
    )
    await project_repo.delete(
      db,
      project,
    )

  @staticmethod
  async def add_milestone(
    db: AsyncSession,
    project_id: str,
    milestone_in: MilestoneCreate,
    organization_id: UUID,
  ):

    await ProjectService.get_project_or_404(
      db,
      project_id,
      organization_id,
    )
    data = milestone_in.model_dump()
    data["project_id"] = project_id
    return await milestone_repo.create(
      db,
      obj_in=data,
    )

  @staticmethod
  async def assign_member(
    db: AsyncSession,
    project_id: str,
    member_in: ProjectMemberCreate,
    organization_id: UUID,
  ):
    await ProjectService.get_project_or_404(
      db,
      project_id,
      organization_id,
    )
    existing = await member_repo.get_by_project_and_user(
      db,
      project_id,
      member_in.user_id,
    )
    
    if existing:
      raise ValidationException(
        message="User is already a member of this project."
      )
    return await member_repo.add_member(
      db,
      project_id,
      member_in.user_id,
      member_in.role,
    )