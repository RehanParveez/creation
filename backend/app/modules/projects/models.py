import enum
import uuid
from datetime import date
from sqlalchemy import String, ForeignKey, Enum, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class ProjectStatus(str, enum.Enum):
  DRAFT = "DRAFT"
  ACTIVE = "ACTIVE"
  ON_HOLD = "ON_HOLD"
  COMPLETED = "COMPLETED"
  CANCELLED = "CANCELLED"
  
class ProjectRole(str, enum.Enum):
  MANAGER = "MANAGER"
  ENGINEER = "ENGINEER"
  VIEWER = "VIEWER"
  
class MilestoneStatus(str, enum.Enum):
  PENDING = "PENDING"
  IN_PROGRESS = "IN_PROGRESS"
  COMPLETED = "COMPLETED"
  
class Client(Base, TimestampMixin):
  __tablename__ = "clients"
  
  id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
  organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id", ondelete = "CASCADE"), nullable=False, index=True)
  name: Mapped[str] = mapped_column(String, nullable=False)
  email: Mapped[str | None] = mapped_column(String, nullable=True)
  phone: Mapped[str | None] = mapped_column(String, nullable=True)
  address: Mapped[str | None] = mapped_column(String, nullable=True)
  projects = relationship("Project", back_populates = "client")
  
class Project(Base, TimestampMixin):
  __tablename__ = "projects"
  
  id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
  organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id", ondelete = "CASCADE"), nullable=False, index=True)
  client_id: Mapped[str | None] = mapped_column(ForeignKey("clients.id", ondelete = "SET NULL"), nullable=True)
  name: Mapped[str] = mapped_column(String, nullable=False)
  description: Mapped[str | None] = mapped_column(Text, nullable=True)
  status: Mapped[ProjectStatus] = mapped_column(Enum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False)
  start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
  end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
  client = relationship("Client", back_populates = "projects")
  members = relationship("ProjectMember", back_populates = "project", cascade = "all, delete-orphan")
  milestones = relationship("Milestone", back_populates = "project", cascade = "all, delete-orphan")
  
class ProjectMember(Base, TimestampMixin):
  __tablename__ = "project_members"
  
  id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
  project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete = "CASCADE"), nullable=False, index=True)
  user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete = "CASCADE"), nullable=False, index=True)
  role: Mapped[ProjectRole] = mapped_column(Enum(ProjectRole), default=ProjectRole.VIEWER, nullable=False)
  project = relationship("Project", back_populates = "members")
  user = relationship("User")
  
class Milestone(Base, TimestampMixin):
  __tablename__ = "milestones"
  
  id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
  project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete = "CASCADE"), nullable=False, index=True)
  title: Mapped[str] = mapped_column(String, nullable=False)
  description: Mapped[str | None] = mapped_column(Text, nullable=True)
  due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
  status: Mapped[MilestoneStatus] = mapped_column(Enum(MilestoneStatus), default=MilestoneStatus.PENDING, nullable=False)
  project = relationship("Project", back_populates = "milestones")