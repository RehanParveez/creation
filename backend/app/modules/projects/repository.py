from sqlalchemy.orm import Session
from app.modules.projects.models import Client, Project, Milestone, ProjectMember

class BaseProjectRepo:
  def update(self, db: Session, db_obj, obj_in: dict):
    for field, value in obj_in.items():
      if value is not None:
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj
  def delete(self, db: Session, db_obj):
    db.delete(db_obj)
    db.commit()
    
class ClientRepository(BaseProjectRepo):
    
  def create(self, db: Session, obj_in: dict) -> Client:
    db_obj = Client(**obj_in)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

  def get_by_org(self, db: Session, organization_id: str, skip: int = 0, limit: int = 100):
    return db.query(Client).filter(Client.organization_id == organization_id).offset(skip).limit(limit).all()

  def get_by_id_and_org(self, db: Session, client_id: str, organization_id: str):
    return db.query(Client).filter(Client.id == client_id, Client.organization_id == organization_id).first()

class ProjectRepository(BaseProjectRepo):
    
  def create(self, db: Session, obj_in: dict) -> Project:
    db_obj = Project(**obj_in)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

  def get_by_org(self, db: Session, organization_id: str, skip: int = 0, limit: int = 100):
    return db.query(Project).filter(Project.organization_id == organization_id).offset(skip).limit(limit).all()

  def get_by_id_and_org(self, db: Session, project_id: str, organization_id: str):
    return db.query(Project).filter(Project.id == project_id, Project.organization_id == organization_id).first()

class MilestoneRepository(BaseProjectRepo):
    
  def create(self, db: Session, obj_in: dict) -> Milestone:
    db_obj = Milestone(**obj_in)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

  def get_by_project(self, db: Session, project_id: str):
    return db.query(Milestone).filter(Milestone.project_id == project_id).all()

  def get_by_id(self, db: Session, milestone_id: str):
    return db.query(Milestone).filter(Milestone.id == milestone_id).first()

class ProjectMemberRepository:
    
  def add_member(self, db: Session, project_id: str, user_id: str, role: str) -> ProjectMember:
    db_obj = ProjectMember(project_id=project_id, user_id=user_id, role=role)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

  def get_by_project(self, db: Session, project_id: str):
    return db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()

  def remove_member(self, db: Session, project_id: str, user_id: str):
    db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).delete()
    db.commit()
client_repo = ClientRepository()
project_repo = ProjectRepository()
milestone_repo = MilestoneRepository()
member_repo = ProjectMemberRepository()