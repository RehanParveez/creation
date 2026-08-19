from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from app.modules.projects.models import ProjectStatus, ProjectRole, MilestoneStatus

class ClientBase(BaseModel):
  name: str
  email: Optional[EmailStr] = None
  phone: Optional[str] = None
  address: Optional[str] = None
  
class ClientCreate(ClientBase):
  pass

class ClientUpdate(ClientBase):
  name: Optional[str] = None
  
class ClientOut(ClientBase):
  id: str
  organization_id: str
  created_at: datetime
  
  class Config:
    from_attributes = True
    
class MilestoneBase(BaseModel):
  title: str
  description: Optional[str] = None
  due_date: Optional[date] = None
  status: MilestoneStatus = MilestoneStatus.PENDING
  
class MilestoneCreate(MilestoneBase):
  pass

class MilestoneUpdate(BaseModel):
  title: Optional[str] = None
  description: Optional[str] = None
  due_date: Optional[date] = None
  status: Optional[MilestoneStatus] = None
  
class MilestoneOut(MilestoneBase):
  id: str
  project_id: str
  class Config:
    from_attributes = True
    
class ProjectMemberBase(BaseModel):
  user_id: str
  role: ProjectRole = ProjectRole.VIEWER
  
class ProjectMemberCreate(ProjectMemberBase):
  pass

class ProjectMemberOut(ProjectMemberBase):
  id: str
  project_id: str
  class Config:
    from_attributes = True
    
class ProjectBase(BaseModel):
  name: str
  description: Optional[str] = None
  client_id: Optional[str] = None
  status: ProjectStatus = ProjectStatus.DRAFT
  start_date: Optional[date] = None
  end_date: Optional[date] = None
  
class ProjectCreate(ProjectBase):
  pass

class ProjectUpdate(BaseModel):
  name: Optional[str] = None
  description: Optional[str] = None
  client_id: Optional[str] = None
  status: Optional[ProjectStatus] = None
  start_date: Optional[date] = None
  end_date: Optional[date] = None
  
class ProjectOut(ProjectBase):
  id: str
  organization_id: str
  created_at: datetime
  milestones: List[MilestoneOut] = []
  members: List[ProjectMemberOut] = []
  class Config:
    from_attributes = True