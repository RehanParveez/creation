from __future__ import annotations
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.identity.models import User
from app.modules.materials_requests.models import MaterialRequisition, MaterialRequisitionItem, MaterialRequisitionPriority, MaterialRequisitionStatus
from app.modules.organizations.models import Organization, OrganizationMembership
from app.modules.projects.models import Project

async def seed_material_requisition(
  db: AsyncSession,
):
  result = await db.execute(
    select(Project, Organization)
    .join(
      Organization,
      Project.organization_id
      == Organization.id,
    )
  )
  row = result.first()
  if not row:
    print(
      "Run Phase 1 and Phase 2 seeders first."
    )
    return
  project, organization = row
  user_result = await db.execute(
    select(User)
    .join(
      OrganizationMembership,
      OrganizationMembership.user_id == User.id,
    )
    .where(
      OrganizationMembership.organization_id
      == organization.id
    )
)
  user = user_result.scalars().first()
  if not user:
    print(
      "No organization user found. "
      "Run user seeders first."
    )
    return
  existing = await db.execute(
    select(MaterialRequisition)
    .where(
      MaterialRequisition.project_id
      == project.id
    )
  )
  if existing.scalar_one_or_none():
    print(
      "Material requisition already seeded."
    )
    return

  requisition = MaterialRequisition(
    organization_id=organization.id,
    project_id=project.id,
    requested_by=user.id,
    requisition_number = "MR-SEED-023",
    title = "Electrical Installation Materials",
    description=(
      "Materials required for the "
      "electrical overhaul."
    ),
    priority=(
      MaterialRequisitionPriority.HIGH
    ),
    status=MaterialRequisitionStatus.DRAFT,
  )

  db.add(requisition)

  await db.flush()

  items = [
    MaterialRequisitionItem(
      requisition_id=requisition.id,
      item_code = "MAT-023",
      material_name = "Electrical Cable",
      description=(
        "Copper electrical cable "
        "for building installation."
      ),
      unit = "M",
      requested_quantity=Decimal(
        "1000"
      ),
      approved_quantity=Decimal(
        "0"
      ),
      fulfilled_quantity=Decimal(
        "0"
      ),
    ),
    MaterialRequisitionItem(
      requisition_id=requisition.id,
      item_code = "MAT-0232",
      material_name = "PVC Conduit",
      description=(
        "Heavy-duty PVC electrical conduit."
      ),
      unit = "M",
      requested_quantity=Decimal(
        "500"
      ),
      approved_quantity=Decimal(
        "0"
      ),
      fulfilled_quantity=Decimal(
        "0"
      ),
    ),
    MaterialRequisitionItem(
      requisition_id=requisition.id,
      item_code = "MAT-0233",
      material_name = "Distribution Box",
      description=(
        "Electrical distribution boxes."
      ),
      unit = "PCS",
      requested_quantity=Decimal(
        "20"
      ),
      approved_quantity=Decimal(
        "0"
      ),
      fulfilled_quantity=Decimal(
        "0"
      ),
    ),
  ]
  
  db.add_all(items)
  await db.commit()
  print(
    "Phase 5 Seed Complete: "
    "Created 1 Material Requisition "
    "with 3 Items."
  )