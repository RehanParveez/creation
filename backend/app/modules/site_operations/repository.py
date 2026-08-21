from __future__ import annotations
from datetime import date
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.modules.projects.models import Project
from app.modules.site_operations.models import SiteLog, SiteLogAttachment, SiteLogIssue

class SiteOperationsRepository:

  def __init__(self, db: AsyncSession) -> None:
    self.db = db

  async def project_belongs_to_organization(
    self,
    project_id: UUID,
    organization_id: UUID,
  ) -> bool:
    result = await self.db.execute(
      select(Project.id).where(
        Project.id == project_id,
        Project.organization_id == organization_id,
      )
    )
    return result.scalar_one_or_none() is not None

  async def create_site_log(
    self,
    site_log: SiteLog,
  ) -> SiteLog:
    self.db.add(site_log)
    await self.db.flush()
    return site_log

  async def get_site_log(
    self,
    site_log_id: UUID,
  ) -> SiteLog | None:
    result = await self.db.execute(
      select(SiteLog)
      .options(
        selectinload(SiteLog.issues),
        selectinload(SiteLog.attachments),
      )
      .where(
        SiteLog.id == site_log_id,
      )
    )
    return result.scalar_one_or_none()

  async def get_site_log_for_project(
    self,
    site_log_id: UUID,
    project_id: UUID,
  ) -> SiteLog | None:
    result = await self.db.execute(
      select(SiteLog)
      .options(
        selectinload(SiteLog.issues),
        selectinload(SiteLog.attachments),
      )
      .where(
        SiteLog.id == site_log_id,
        SiteLog.project_id == project_id,
      )
    )
    return result.scalar_one_or_none()

  async def get_site_log_by_date(
    self,
    project_id: UUID,
    report_date: date,
  ) -> SiteLog | None:
    result = await self.db.execute(
      select(SiteLog)
      .where(
        SiteLog.project_id == project_id,
        SiteLog.report_date == report_date,
      )
    )
    return result.scalar_one_or_none()

  async def list_site_logs(
    self,
    project_id: UUID,
    skip: int = 0,
    limit: int = 100,
  ) -> list[SiteLog]:
    result = await self.db.execute(
      select(SiteLog)
      .options(
        selectinload(SiteLog.issues),
        selectinload(SiteLog.attachments),
      )
      .where(
        SiteLog.project_id == project_id,
      )
      .order_by(
        SiteLog.report_date.desc(),
      )
      .offset(skip)
      .limit(limit)
    )
    return list(
      result.scalars().unique().all()
    )

  async def create_issue(
    self,
    issue: SiteLogIssue,
  ) -> SiteLogIssue:
    self.db.add(issue)
    await self.db.flush()
    return issue

  async def get_issue(
    self,
    issue_id: UUID,
  ) -> SiteLogIssue | None:
    result = await self.db.execute(
      select(SiteLogIssue).where(
        SiteLogIssue.id == issue_id,
      )
    )
    return result.scalar_one_or_none()

  async def get_issue_for_site_log(
    self,
    issue_id: UUID,
    site_log_id: UUID,
  ) -> SiteLogIssue | None:
    result = await self.db.execute(
      select(SiteLogIssue).where(
        SiteLogIssue.id == issue_id,
        SiteLogIssue.site_log_id == site_log_id,
      )
    )
    return result.scalar_one_or_none()

  async def list_issues(
    self,
    site_log_id: UUID,
  ) -> list[SiteLogIssue]:
    result = await self.db.execute(
      select(SiteLogIssue)
      .where(
        SiteLogIssue.site_log_id == site_log_id,
      )
      .order_by(
        SiteLogIssue.created_at.desc(),
      )
    )
    return list(result.scalars().all())

  async def create_attachment(
    self,
    attachment: SiteLogAttachment,
  ) -> SiteLogAttachment:
    self.db.add(attachment)
    await self.db.flush()
    return attachment

  async def get_attachment(
    self,
    attachment_id: UUID,
  ) -> SiteLogAttachment | None:
    result = await self.db.execute(
      select(SiteLogAttachment).where(
        SiteLogAttachment.id == attachment_id,
      )
    )
    return result.scalar_one_or_none()

  async def get_attachment_for_site_log(
    self,
    attachment_id: UUID,
    site_log_id: UUID,
  ) -> SiteLogAttachment | None:
    result = await self.db.execute(
      select(SiteLogAttachment).where(
        SiteLogAttachment.id == attachment_id,
        SiteLogAttachment.site_log_id == site_log_id,
      )
    )
    return result.scalar_one_or_none()

  async def delete_attachment(
    self,
    attachment: SiteLogAttachment,
  ) -> None:
    await self.db.delete(attachment)
    await self.db.flush()

  async def commit(self) -> None:
    await self.db.commit()

  async def rollback(self) -> None:
    await self.db.rollback()

  async def refresh(
    self,
    entity: object,
  ) -> None:
    await self.db.refresh(entity)