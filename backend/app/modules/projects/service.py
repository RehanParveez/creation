from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.projects.repository import client_repo, project_repo, milestone_repo, member_repo
from app.modules.projects.schemas import ClientCreate, ProjectCreate, MilestoneCreate, ProjectMemberCreate
from app.modules.projects.models import ProjectMember

class ProjectService:
  
  @staticmethod
  def create_client(db: Session, client_in: ClientCreate, organization_id: str):
    data = client_in.model_dump()
    data["organization_id"] = organization_id
    return client_repo.create(db, obj_in=data)
  
  @staticmethod
  def create_project(db: Session, project_in: ProjectCreate, organization_id: str):
    data = project_in.model_dump()
    if data.get("client_id"):
      client = client_repo.get_by_id_and_org(db, data["client_id"], organization_id)
      if not client:
        raise HTTPException(status_code=404, detail="Client not found in your organization")
    data["organization_id"] = organization_id
    return project_repo.create(db, obj_in=data)
  
  @staticmethod
  def get_project_or_404(db: Session, project_id: str, organization_id: str):
    project = project_repo.get_by_id_and_org(db, project_id, organization_id)
    if not project:
      raise HTTPException(status_code=404, detail = "Project not found in your organization")
    return project
  
  @staticmethod
  def delete_project(db: Session, project_id: str, organization_id: str):
    project = ProjectService.get_project_or_404(db, project_id, organization_id)
    project_repo.delete(db, project)
    
  @staticmethod
  def add_milestone(db: Session, project_id: str, milestone_in: MilestoneCreate, organization_id: str):
    ProjectService.get_project_or_404(db, project_id, organization_id)
    data = milestone_in.model_dump()
    data["project_id"] = project_id
    return milestone_repo.create(db, obj_in=data)
  
  @staticmethod
  def assign_member(db: Session, project_id: str, member_in: ProjectMemberCreate, organization_id: str):
    ProjectService.get_project_or_404(db, project_id, organization_id)
    existing = db.query(ProjectMember).filter_by(project_id=project_id, user_id=member_in.user_id).first()
    if existing:
      raise HTTPException(status_code=400, detail = "User is already a member of this project")
    return member_repo.add_member(db, project_id, member_in.user_id, member_in.role)