from __future__ import annotations
import enum
import uuid
from datetime import date
from uuid import UUID
from sqlalchemy import Date, Enum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class SiteLogStatus(str, enum.Enum):
  DRAFT = "DRAFT"
  SUBMITTED = "SUBMITTED"
  REVIEWED = "REVIEWED"
  RETURNED = "RETURNED"
  APPROVED = "APPROVED"

class WeatherCondition(str, enum.Enum):
  SUNNY = "SUNNY"
  PARTLY_CLOUDY = "PARTLY_CLOUDY"
  CLOUDY = "CLOUDY"
  RAIN = "RAIN"
  HEAVY_RAIN = "HEAVY_RAIN"
  STORM = "STORM"
  EXTREME_HEAT = "EXTREME_HEAT"
  OTHER = "OTHER"

class IssueSeverity(str, enum.Enum):
  LOW = "LOW"
  MEDIUM = "MEDIUM"
  HIGH = "HIGH"
  CRITICAL = "CRITICAL"

class IssueStatus(str, enum.Enum):
  OPEN = "OPEN"
  IN_PROGRESS = "IN_PROGRESS"
  RESOLVED = "RESOLVED"
  CLOSED = "CLOSED"

class SiteLog(Base, TimestampMixin):
  __tablename__ = "site_logs"
  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  project_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "projects.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
    index=True,
  )
  report_date: Mapped[date] = mapped_column(
    Date,
    nullable=False,
  )
  status: Mapped[SiteLogStatus] = mapped_column(
    Enum(
      SiteLogStatus,
      name = "site_log_status",
    ),
    default=SiteLogStatus.DRAFT,
    nullable=False,
    index=True,
  )
  weather: Mapped[WeatherCondition | None] = mapped_column(
    Enum(
      WeatherCondition,
      name = "weather_condition",
    ),
    nullable=True,
  )
  weather_notes: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  workers_count: Mapped[int] = mapped_column(
    Integer,
    default=0,
    nullable=False,
  )
  work_completed: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  material_summary: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  equipment_summary: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  progress_percent: Mapped[float] = mapped_column(
    Float,
    default=0,
    nullable=False,
  )
  blockers: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  reviewer_notes: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  submitted_by_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "users.id",
      ondelete = "RESTRICT",
    ),
    nullable=False,
  )
  reviewed_by_id: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "users.id",
      ondelete = "SET NULL",
    ),
    nullable=True,
  )

  project = relationship(
    "Project",
    lazy = "joined",
  )
  submitted_by = relationship(
    "User",
    foreign_keys=[submitted_by_id],
    lazy = "joined",
  )
  reviewed_by = relationship(
    "User",
    foreign_keys=[reviewed_by_id],
    lazy = "joined",
  )
  issues = relationship(
    "SiteLogIssue",
    back_populates = "site_log",
    cascade = "all, delete-orphan",
    lazy = "selectin",
  )
  attachments = relationship(
    "SiteLogAttachment",
    back_populates = "site_log",
    cascade = "all, delete-orphan",
    lazy = "selectin",
  )

  __table_args__ = (
    UniqueConstraint(
      "project_id",
      "report_date",
      name = "uq_site_log_project_report_date",
    ),
    Index(
      "ix_site_logs_project_status",
      "project_id",
      "status",
    ),
    Index(
      "ix_site_logs_project_report_date",
      "project_id",
      "report_date",
    ),
  )

class SiteLogIssue(Base, TimestampMixin):
  __tablename__ = "site_log_issues"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  site_log_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "site_logs.id",
      ondelete = "CASCADE",
    ),
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
  severity: Mapped[IssueSeverity] = mapped_column(
    Enum(
      IssueSeverity,
      name="site_issue_severity",
    ),
    default=IssueSeverity.MEDIUM,
    nullable=False,
  )
  status: Mapped[IssueStatus] = mapped_column(
    Enum(
      IssueStatus,
      name = "site_issue_status",
    ),
    default=IssueStatus.OPEN,
    nullable=False,
    index=True,
  )
  resolution: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )
  site_log = relationship(
    "SiteLog",
    back_populates = "issues",
  )

class SiteLogAttachment(Base, TimestampMixin):
  __tablename__ = "site_log_attachments"

  id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )
  site_log_id: Mapped[UUID] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey(
      "site_logs.id",
      ondelete = "CASCADE",
    ),
    nullable=False,
    index=True,
  )
  file_name: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )
  storage_key: Mapped[str] = mapped_column(
    String(500),
    nullable=False,
    unique=True,
  )
  content_type: Mapped[str] = mapped_column(
    String(150),
    nullable=False,
  )
  size_bytes: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
  )
  site_log = relationship(
    "SiteLog",
    back_populates = "attachments",
  )