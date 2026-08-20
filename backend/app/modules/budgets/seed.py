from __future__ import annotations
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.budgets.models import Budget, BudgetItem, BudgetItemCategory, BudgetStatus
from app.modules.organizations.models import Organization
from app.modules.projects.models import Project

async def seed_budget(db: AsyncSession):
  result = await db.execute(
    select(Project, Organization)
    .join(
      Organization,
      Project.organization_id == Organization.id,
    )
  )
  row = result.first()
  if not row:
    print(
      "Run Phase 1 and Phase 2 seeders first."
    )
    return

  project, organization = row
  existing = await db.execute(
    select(Budget).where(
      Budget.project_id == project.id
    )
  )
  if existing.scalar_one_or_none():
    print("Budget already seeded.")
    return

  budget = Budget(
    organization_id=organization.id,
    project_id=project.id,
    name = "Downtown Skyscraper Refit — BOQ",
    description=(
      "Initial construction budget "
      "and bill of quantities."
    ),
    status=BudgetStatus.DRAFT,
  )

  db.add(budget)
  await db.flush()

  items = [
    BudgetItem(
      budget_id=budget.id,
      item_code = "MAT-001",
      description = "Portland Cement",
      category=BudgetItemCategory.MATERIALS,
      unit = "BAG",
      planned_quantity=Decimal("500"),
      estimated_unit_cost=Decimal("1450.00"),
      estimated_total_cost=Decimal("725000.00"),
      actual_cost=Decimal("0.00"),
    ),
    BudgetItem(
      budget_id=budget.id,
      item_code = "MAT-002",
      description = "Electrical Cable",
      category=BudgetItemCategory.MATERIALS,
      unit = "M",
      planned_quantity=Decimal("2000"),
      estimated_unit_cost=Decimal("350.00"),
      estimated_total_cost=Decimal("700000.00"),
      actual_cost=Decimal("0.00"),
    ),
    BudgetItem(
      budget_id=budget.id,
      item_code = "LAB-001",
      description = "Electrical Installation Labour",
      category=BudgetItemCategory.LABOUR,
      unit = "DAY",
      planned_quantity=Decimal("120"),
      estimated_unit_cost=Decimal("5000.00"),
      estimated_total_cost=Decimal("600000.00"),
      actual_cost=Decimal("0.00"),
    ),
  ]

  db.add_all(items)
  await db.commit()
  print(
    "Phase 3 Seed Complete: "
    "Created 1 Budget with 3 Budget Items."
  )