from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies.auth import get_db, get_current_user, require_permissions
from app.modules.projects.schemas import ProjectCreate, ProjectOut, ClientCreate, ClientOut, MilestoneCreate, MilestoneOut, ProjectMemberCreate, ProjectMemberOut
from app.modules.projects.service import ProjectService
from app.modules.projects.repository import client_repo, project_repo, milestone_repo, member_repo
from app.modules.projects.permissions import Permissions

router = APIRouter()

@router.post("/clients", response_model=ClientOut, dependencies=[Depends(require_permissions([Permissions.CLIENT_CREATE]))])
def create_client(client_in: ClientCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return ProjectService.create_client(db, client_in, current_user.organization_id)

@router.get("/clients", response_model=List[ClientOut], dependencies=[Depends(require_permissions([Permissions.CLIENT_READ]))])
def get_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return client_repo.get_by_org(db, current_user.organization_id, skip, limit)

@router.post("/", response_model=ProjectOut, dependencies=[Depends(require_permissions([Permissions.PROJECT_CREATE]))])
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return ProjectService.create_project(db, project_in, current_user.organization_id)

@router.get("/", response_model=List[ProjectOut], dependencies=[Depends(require_permissions([Permissions.PROJECT_READ]))])
def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return project_repo.get_by_org(db, current_user.organization_id, skip, limit)

@router.get("/{project_id}", response_model=ProjectOut, dependencies=[Depends(require_permissions([Permissions.PROJECT_READ]))])
def get_project(project_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return ProjectService.get_project_or_404(db, project_id, current_user.organization_id)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permissions([Permissions.PROJECT_DELETE]))])
def delete_project(project_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  ProjectService.delete_project(db, project_id, current_user.organization_id)
  
@router.post("/{project_id}/milestones", response_model=MilestoneOut, dependencies=[Depends(require_permissions([Permissions.PROJECT_UPDATE]))])
def create_milestone(project_id: str, milestone_in: MilestoneCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return ProjectService.add_milestone(db, project_id, milestone_in, current_user.organization_id)

@router.get("/{project_id}/milestones", response_model=List[MilestoneOut], dependencies=[Depends(require_permissions([Permissions.PROJECT_READ]))])
def get_milestones(project_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  ProjectService.get_project_or_404(db, project_id, current_user.organization_id)
  return milestone_repo.get_by_project(db, project_id)

@router.post("/{project_id}/members", response_model=ProjectMemberOut, dependencies=[Depends(require_permissions([Permissions.PROJECT_UPDATE]))])
def assign_member(project_id: str, member_in: ProjectMemberCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  return ProjectService.assign_member(db, project_id, member_in, current_user.organization_id)

@router.get("/{project_id}/members", response_model=List[ProjectMemberOut], dependencies=[Depends(require_permissions([Permissions.PROJECT_READ]))])
def get_project_members(project_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  ProjectService.get_project_or_404(db, project_id, current_user.organization_id)
  return member_repo.get_by_project(db, project_id)

@router.delete("/{project_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permissions([Permissions.PROJECT_UPDATE]))])
def remove_project_member(project_id: str, user_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
  ProjectService.get_project_or_404(db, project_id, current_user.organization_id)
  member_repo.remove_member(db, project_id, user_id)