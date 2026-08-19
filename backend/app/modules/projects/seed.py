from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.projects.models import Client, Project, ProjectStatus
from app.modules.organizations.models import Organization

async def seed_clients_and_projects(db: AsyncSession):
  result = await db.execute(select(Organization))
  org = result.scalars().first()
  if not org:
    print("Run Phase 1 seeders first (Organizations missing)")
    return
  client_result = await db.execute(select(Client).filter_by(organization_id=org.id))
  if client_result.scalars().first():
    print("Clients & Projects already seeded.")
    return

  client = Client(
      organization_id=org.id,
      name = "Acme Corp",
      email = "contact@acme.corp",
      phone = "+923140147282"
  )
  db.add(client)
  await db.flush()
  project = Project(
      organization_id=org.id,
      client_id=client.id,
      name="Downtown Skyscraper Refit",
      description="Complete HVAC and electrical overhaul.",
      status=ProjectStatus.ACTIVE,
  )
  db.add(project)
  await db.commit()
  print("Phase 2 Seed Complete: Created 1 Client and 1 Project.")