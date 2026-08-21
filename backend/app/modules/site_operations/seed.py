from __future__ import annotations
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.identity.models import User
from app.modules.projects.models import Project
from app.modules.site_operations.models import IssueSeverity, IssueStatus, SiteLog, SiteLogIssue, SiteLogStatus, WeatherCondition

async def seed_site_operations(
  db: AsyncSession,
) -> None:

  project_result = await db.execute(
    select(Project)
    .order_by(Project.created_at.asc())
  )
  project = project_result.scalars().first()
  if project is None:
    print(
      "Run previous seeders first "
      "(Projects missing)."
    )
    return

  user_result = await db.execute(
    select(User)
    .order_by(User.created_at.asc())
  )
  user = user_result.scalars().first()
  if user is None:
    print(
      "Run Identity seeders first "
      "(Users missing)."
    )
    return

  existing_result = await db.execute(
    select(SiteLog).where(
      SiteLog.project_id == project.id,
      SiteLog.report_date == date.today(),
    )
  )
  existing = existing_result.scalar_one_or_none()
  if existing:
    print(
      "Site Operations already seeded."
    )
    return

  site_log = SiteLog(
    project_id=project.id,
    report_date=date.today(),
    status=SiteLogStatus.SUBMITTED,
    weather=WeatherCondition.SUNNY,
    weather_notes = "Clear working conditions.",
    workers_count=34,
    work_completed=(
      "HVAC duct installation and electrical "
      "cabling continued on Level 4."
    ),
    material_summary=(
      "HVAC duct sections, copper cable "
      "and electrical conduit delivered."
    ),
    equipment_summary=(
      "Tower crane and welding equipment "
      "operational."
    ),
    progress_percent=62.5,
    blockers=(
      "Minor delay in delivery of electrical "
      "switchgear."
    ),
    submitted_by_id=user.id,
  )

  db.add(site_log)
  await db.flush()

  issue = SiteLogIssue(
    site_log_id=site_log.id,
    title = "Switchgear delivery delay",
    description=(
      "Main switchgear shipment has been delayed "
      "by the supplier."
    ),
    severity=IssueSeverity.MEDIUM,
    status=IssueStatus.OPEN,
  )
  db.add(issue)
  await db.commit()

  print(
    "Site Operations seed complete: "
    "Created 1 site log and 1 issue."
  )