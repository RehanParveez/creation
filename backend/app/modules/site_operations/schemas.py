from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.modules.site_operations.models import IssueSeverity, IssueStatus, SiteLogStatus, WeatherCondition

class SiteLogCreate(BaseModel):
  report_date: date
  weather: WeatherCondition | None = None
  weather_notes: str | None = None
  workers_count: int = Field(default=0, ge=0,
  )
  work_completed: str | None = None
  material_summary: str | None = None
  equipment_summary: str | None = None
  progress_percent: float = Field(
    default=0,
    ge=0,
    le=100,
  )
  blockers: str | None = None

class SiteLogUpdate(BaseModel):
  weather: WeatherCondition | None = None
  weather_notes: str | None = None
  workers_count: int | None = Field(
    default=None,
    ge=0,
  )
  work_completed: str | None = None
  material_summary: str | None = None
  equipment_summary: str | None = None
  progress_percent: float | None = Field(default=None, ge=0, le=100,
  )
  blockers: str | None = None

class SiteLogReviewRequest(BaseModel):
  notes: str | None = None

class SiteLogReturnRequest(BaseModel):
  notes: str = Field(min_length=1, max_length=5000,
  )

class SiteLogIssueCreate(BaseModel):
  title: str = Field(min_length=1, max_length=200,
  )
  description: str | None = None
  severity: IssueSeverity = IssueSeverity.MEDIUM

class SiteLogIssueUpdate(BaseModel):
  title: str | None = Field(default=None, min_length=1, max_length=200,
  )
  description: str | None = None
  severity: IssueSeverity | None = None
  status: IssueStatus | None = None
  resolution: str | None = None

class SiteLogIssueRead(BaseModel):
  model_config = ConfigDict(from_attributes=True,
  )

  id: UUID
  site_log_id: UUID
  title: str
  description: str | None
  severity: IssueSeverity
  status: IssueStatus
  resolution: str | None
  created_at: datetime
  updated_at: datetime
  
class SiteLogAttachmentCreate(BaseModel):
  file_name: str = Field(
    min_length=1,
    max_length=255,
  )
  storage_key: str = Field(
    min_length=1,
    max_length=500,
  )
  content_type: str = Field(
    min_length=1,
    max_length=150,
  )
  size_bytes: int = Field(ge=0,
  )

class SiteLogAttachmentRead(BaseModel):
  model_config = ConfigDict(from_attributes=True,
  )

  id: UUID
  site_log_id: UUID
  file_name: str
  content_type: str
  size_bytes: int
  created_at: datetime

class SiteLogRead(BaseModel):
  model_config = ConfigDict(from_attributes=True,
  )

  id: UUID
  project_id: UUID
  report_date: date
  status: SiteLogStatus
  weather: WeatherCondition | None
  weather_notes: str | None
  workers_count: int
  work_completed: str | None
  material_summary: str | None
  equipment_summary: str | None
  progress_percent: float
  blockers: str | None
  reviewer_notes: str | None
  submitted_by_id: UUID
  reviewed_by_id: UUID | None
  created_at: datetime
  updated_at: datetime
  issues: list[SiteLogIssueRead] = []
  attachments: list[SiteLogAttachmentRead] = []