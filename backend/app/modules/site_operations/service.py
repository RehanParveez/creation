from __future__ import annotations
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import NotFoundException, ValidationException
from app.modules.identity.models import User
from app.modules.site_operations.models import IssueStatus, SiteLog, SiteLogAttachment, SiteLogIssue, SiteLogStatus
from app.modules.site_operations.repository import SiteOperationsRepository
from app.modules.site_operations.schemas import SiteLogAttachmentCreate, SiteLogCreate, SiteLogIssueCreate, SiteLogIssueUpdate, SiteLogReturnRequest, SiteLogReviewRequest, SiteLogUpdate

class SiteOperationsService:

  def __init__(
    self,
    db: AsyncSession,
  ) -> None:
    self.db = db
    self.repository = SiteOperationsRepository(db)

  async def require_project(
    self,
    project_id: UUID,
    organization_id: UUID,
  ) -> None:
    exists = await self.repository.project_belongs_to_organization(
      project_id,
      organization_id,
    )
    if not exists:
      raise NotFoundException("Project")

  async def create_site_log(
    self,
    user: User,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogCreate,
  ) -> SiteLog:

    await self.require_project(
      project_id,
      organization_id,
    )
    existing = await self.repository.get_site_log_by_date(
      project_id,
      data.report_date,
    )

    if existing:
      raise ValidationException(
        message=(
          "A site log already exists for this project "
          "and report date."
        )
      )
    site_log = SiteLog(
      project_id=project_id,
      report_date=data.report_date,
      weather=data.weather,
      weather_notes=data.weather_notes,
      workers_count=data.workers_count,
      work_completed=data.work_completed,
      material_summary=data.material_summary,
      equipment_summary=data.equipment_summary,
      progress_percent=data.progress_percent,
      blockers=data.blockers,
      submitted_by_id=user.id,
      status=SiteLogStatus.DRAFT,
    )
    await self.repository.create_site_log(site_log)
    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )

    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def list_site_logs(
    self,
    project_id: UUID,
    organization_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[SiteLog]:

    await self.require_project(
      project_id,
      organization_id,
    )
    return await self.repository.list_site_logs(
      project_id,
      skip,
      limit,
    )

  async def get_site_log(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> SiteLog:

    await self.require_project(
      project_id,
      organization_id,
    )
    site_log = await self.repository.get_site_log_for_project(
      site_log_id,
      project_id,
    )
    if site_log is None:
      raise NotFoundException("Site log")
    return site_log

  async def update_site_log(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogUpdate,
  ) -> SiteLog:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status not in {
      SiteLogStatus.DRAFT,
      SiteLogStatus.RETURNED,
    }:
      raise ValidationException(
        message=(
          "Only draft or returned site logs can be edited."
        )
      )
    values = data.model_dump(
      exclude_unset=True,
    )
    for field, value in values.items():
      setattr(
        site_log,
        field,
        value,
      )

    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )
    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def submit_site_log(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> SiteLog:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status not in {
      SiteLogStatus.DRAFT,
      SiteLogStatus.RETURNED,
    }:
      raise ValidationException(
        message=(
          "Only draft or returned site logs "
          "can be submitted."
        )
      )

    site_log.status = SiteLogStatus.SUBMITTED
    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )
    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def review_site_log(
    self,
    user: User,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogReviewRequest,
  ) -> SiteLog:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status != SiteLogStatus.SUBMITTED:
      raise ValidationException(
        message=(
          "Only submitted site logs can be reviewed."
        )
      )
    site_log.status = SiteLogStatus.REVIEWED
    site_log.reviewed_by_id = user.id
    site_log.reviewer_notes = data.notes

    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )
    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def return_site_log(
    self,
    user: User,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogReturnRequest,
  ) -> SiteLog:
    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status not in {
      SiteLogStatus.SUBMITTED,
      SiteLogStatus.REVIEWED,
    }:
      raise ValidationException(
        message=(
          "Only submitted or reviewed site logs "
          "can be returned."
        )
      )

    site_log.status = SiteLogStatus.RETURNED
    site_log.reviewed_by_id = user.id
    site_log.reviewer_notes = data.notes

    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )
    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def approve_site_log(
    self,
    user: User,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> SiteLog:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status != SiteLogStatus.REVIEWED:
      raise ValidationException(
        message=(
          "Only reviewed site logs can be approved."
        )
      )

    site_log.status = SiteLogStatus.APPROVED
    site_log.reviewed_by_id = user.id
    await self.repository.commit()
    refreshed = await self.repository.get_site_log(
      site_log.id
    )
    if refreshed is None:
      raise NotFoundException("Site log")
    return refreshed

  async def list_issues(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> list[SiteLogIssue]:

    await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    return await self.repository.list_issues(
      site_log_id,
    )

  async def create_issue(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogIssueCreate,
  ) -> SiteLogIssue:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    if site_log.status == SiteLogStatus.APPROVED:
      raise ValidationException(
        message=(
          "Issues cannot be created on an approved site log."
        )
      )
    issue = SiteLogIssue(
      site_log_id=site_log_id,
      title=data.title.strip(),
      description=data.description,
      severity=data.severity,
      status=IssueStatus.OPEN,
    )
    await self.repository.create_issue(issue)
    await self.repository.commit()

    refreshed = await self.repository.get_issue(
      issue.id
    )
    if refreshed is None:
      raise NotFoundException("Site log issue")
    return refreshed

  async def update_issue(
    self,
    issue_id: UUID,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogIssueUpdate,
  ) -> SiteLogIssue:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )

    if site_log.status == SiteLogStatus.APPROVED:
      raise ValidationException(
        message=(
          "Issues cannot be modified on "
          "an approved site log."
        )
      )

    issue = await self.repository.get_issue_for_site_log(
      issue_id,
      site_log_id,
    )
    if issue is None:
      raise NotFoundException("Site log issue")
    values = data.model_dump(
      exclude_unset=True,
    )
    if "title" in values and values["title"] is not None:
      values["title"] = values["title"].strip()
    for field, value in values.items():
      setattr(
        issue,
        field,
        value,
      )
    await self.repository.commit()
    refreshed = await self.repository.get_issue(
      issue.id
    )
    if refreshed is None:
      raise NotFoundException("Site log issue")
    return refreshed

  async def resolve_issue(
    self,
    issue_id: UUID,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    resolution: str,
  ) -> SiteLogIssue:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    issue = await self.repository.get_issue_for_site_log(
      issue_id,
      site_log_id,
    )
    if issue is None:
      raise NotFoundException("Site log issue")

    if issue.status in {
      IssueStatus.RESOLVED,
      IssueStatus.CLOSED,
    }:
      raise ValidationException(
        message = "This issue has already been resolved or closed."
      )
    issue.status = IssueStatus.RESOLVED
    issue.resolution = resolution
    await self.repository.commit()
    refreshed = await self.repository.get_issue(
      issue.id
    )
    if refreshed is None:
      raise NotFoundException("Site log issue")

    return refreshed

  async def list_attachments(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> list[SiteLogAttachment]:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )
    return list(site_log.attachments)

  async def create_attachment(
    self,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
    data: SiteLogAttachmentCreate,
  ) -> SiteLogAttachment:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )

    if site_log.status == SiteLogStatus.APPROVED:
      raise ValidationException(
        message=(
          "Attachments cannot be added "
          "to an approved site log."
        )
      )

    attachment = SiteLogAttachment(
      site_log_id=site_log_id,
      file_name=data.file_name,
      storage_key=data.storage_key,
      content_type=data.content_type,
      size_bytes=data.size_bytes,
    )
    await self.repository.create_attachment(
      attachment
    )
    await self.repository.commit()
    refreshed = await self.repository.get_attachment(
      attachment.id
    )
    if refreshed is None:
      raise NotFoundException("Attachment")
    return refreshed

  async def delete_attachment(
    self,
    attachment_id: UUID,
    site_log_id: UUID,
    project_id: UUID,
    organization_id: UUID,
  ) -> None:

    site_log = await self.get_site_log(
      site_log_id,
      project_id,
      organization_id,
    )

    if site_log.status == SiteLogStatus.APPROVED:
      raise ValidationException(
        message=(
          "Attachments cannot be deleted "
          "from an approved site log."
        )
      )

    attachment = (
      await self.repository.get_attachment_for_site_log(
        attachment_id,
        site_log_id,
      )
    )
    if attachment is None:
      raise NotFoundException("Attachment")
    await self.repository.delete_attachment(
      attachment
    )
    await self.repository.commit()