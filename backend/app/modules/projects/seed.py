from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.organizations.models import Organization
from app.modules.identity.models import User
from app.modules.projects.models import Client, ProjectStatus, Project, ProjectRole, ProjectMember, MilestoneStatus, Milestone
from datetime import date, timedelta

async def seed_projects(db: AsyncSession):
  result = await db.execute(
    select(Organization)
    .order_by(Organization.created_at)
  )

  organization = result.scalars().first()
  if not organization:
    print("Run organization seeders first.")
    return
  org_id = organization.id
  result = await db.execute(
    select(User)
    .order_by(User.created_at)
    .limit(10)
  )
  users = list(result.scalars().all())
  if not users:
    print("Run identity/user seeders first.")
    return

  result = await db.execute(
    select(Client)
    .where(Client.organization_id == org_id)
    .limit(1)
  )
  if result.scalars().first():
    print("Projects module already contains clients.")
    print("Skipping Projects seed.")
    return

  clients = []
  client_data = [
    ("Acme Construction Ltd", "contact@acme.com"),
    ("PakBuild Industries", "info@pakbuild.com"),
    ("Urban Heights Developers", "admin@urbanheights.com"),
    ("National Infrastructure Co.", "projects@nic.com"),
    ("Green Valley Developers", "contact@greenvalley.com"),
    ("Metro Commercial Group", "info@metrocommercial.com"),
    ("Capital Builders", "hello@capitalbuilders.com"),
    ("Prime Estate Developers", "info@primeestate.com"),
    ("Modern Structures Ltd", "contact@modernstructures.com"),
    ("FutureWorks Construction", "admin@futureworks.com"),
  ]
  for index, (name, email) in enumerate(client_data, start=1):
    client = Client(
      organization_id=org_id,
      name=name,
      email=email,
      phone=f"+92 300 00000{index:02d}",
      address=f"{index} Construction Avenue, Islamabad",
    )
    db.add(client)
    clients.append(client)
  await db.flush()

  projects = []
  project_data = [
    ("Downtown Commercial Tower", ProjectStatus.ACTIVE),
    ("Green Valley Housing Project", ProjectStatus.ACTIVE),
    ("Metro Office Complex", ProjectStatus.ON_HOLD),
    ("Capital Business Center", ProjectStatus.ACTIVE),
    ("National Highway Expansion", ProjectStatus.DRAFT),
    ("Riverside Residential Development", ProjectStatus.ACTIVE),
    ("Industrial Warehouse Complex", ProjectStatus.COMPLETED),
    ("City Hospital Expansion", ProjectStatus.ACTIVE),
    ("Modern Shopping Mall", ProjectStatus.DRAFT),
    ("Airport Infrastructure Upgrade", ProjectStatus.ON_HOLD),
  ]
  base_date = date.today()
  for index, (name, status) in enumerate(project_data):
    start_date = base_date - timedelta(days=index * 30)

    project = Project(
      organization_id=org_id,
      client_id=clients[index].id,
      name=name,
      description=(
        f"Construction and project management activities "
        f"for {name}."
      ),
      status=status,
      start_date=start_date,
      end_date=start_date + timedelta(days=180),
    )
    db.add(project)
    projects.append(project)
  await db.flush()

  roles = [
    ProjectRole.MANAGER,
    ProjectRole.ENGINEER,
  ]

  for index, project in enumerate(projects):
    user_1 = users[index % len(users)]
    user_2 = users[(index + 1) % len(users)]

    assignments = [
      (user_1, ProjectRole.MANAGER),
    ]

    if user_2.id != user_1.id:
      assignments.append(
        (user_2, ProjectRole.ENGINEER)
      )

    for user, role in assignments:
      member = ProjectMember(project_id=project.id, user_id=user.id, role=role,
      )
      db.add(member)
  milestone_templates = [
    ("Planning & Design", MilestoneStatus.COMPLETED),
    ("Foundation Work", MilestoneStatus.IN_PROGRESS),
    ("Structural Construction", MilestoneStatus.PENDING),
  ]

  for index, project in enumerate(projects):
    for milestone_index, (title, status) in enumerate(
      milestone_templates
    ):
      milestone = Milestone(
        project_id=project.id,
        title=title,
        description=(
          f"{title} milestone for "
          f"{project.name}."
        ),
        due_date=(
          base_date
          + timedelta(
            days=(index * 15) + (milestone_index * 30)
          )
        ),
        status=status,
      )

      db.add(milestone)

  await db.commit()

  print("Projects module seed complete.")
  print(f"   Clients:        {len(clients)}")
  print(f"   Projects:       {len(projects)}")
  print(f"   Members:        {len(projects) * 2 if len(users) > 1 else len(projects)}")
  print(f"   Milestones:     {len(projects) * 3}")