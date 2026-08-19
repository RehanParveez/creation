from __future__ import annotations
import enum
import uuid
from datetime import date
from uuid import UUID
from sqlalchemy import Date, Enum, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
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

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  organization_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("organizations.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  name: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )

  email: Mapped[str | None] = mapped_column(
    String(320),
    nullable=True,
  )

  phone: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
  )

  address: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )

  organization = relationship(
    "Organization",
    lazy = "joined",
  )

  projects = relationship(
    "Project",
    back_populates="client",
  )

class Project(Base, TimestampMixin):
  __tablename__ = "projects"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  organization_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("organizations.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  client_id: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("clients.id", ondelete = "SET NULL"),
    nullable=True,
    index=True,
  )

  name: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )

  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  status: Mapped[ProjectStatus] = mapped_column(
    Enum(ProjectStatus, name = "project_status"),
    default=ProjectStatus.DRAFT,
    nullable=False,
    index=True,
  )

  start_date: Mapped[date | None] = mapped_column(
    Date,
    nullable=True,
  )

  end_date: Mapped[date | None] = mapped_column(
    Date,
    nullable=True,
  )

  organization = relationship(
    "Organization",
    lazy = "joined",
  )

  client = relationship(
    "Client",
    back_populates = "projects",
  )

  members = relationship(
    "ProjectMember",
    back_populates = "project",
    cascade = "all, delete-orphan",
  )

  milestones = relationship(
    "Milestone",
    back_populates = "project",
    cascade = "all, delete-orphan",
  )

  __table_args__ = (
    Index(
      "ix_projects_org_status",
      "organization_id",
      "status",
    ),
  )

class ProjectMember(Base, TimestampMixin):
  __tablename__ = "project_members"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  project_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("projects.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  user_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("users.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  role: Mapped[ProjectRole] = mapped_column(
    Enum(ProjectRole, name = "project_role"),
    default=ProjectRole.VIEWER,
    nullable=False,
  )

  project = relationship(
    "Project",
    back_populates="members",
  )

  user = relationship(
    "User",
    lazy = "joined",
  )

  __table_args__ = (
    UniqueConstraint(
      "project_id",
      "user_id",
      name = "uq_project_member_project_user",
    ),
  )


class Milestone(Base, TimestampMixin):
  __tablename__ = "milestones"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  project_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("projects.id", ondelete = "CASCADE"),
    nullable=False,
    index=True,
  )

  title: Mapped[str] = mapped_column(
    String(200),
    nullable=False,
  )

  description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  due_date: Mapped[date | None] = mapped_column(
    Date,
    nullable=True,
  )

  status: Mapped[MilestoneStatus] = mapped_column(
    Enum(MilestoneStatus, name = "milestone_status"),
    default=MilestoneStatus.PENDING,
    nullable=False,
    index=True,
  )

  project = relationship(
    "Project",
    back_populates = "milestones",
  )