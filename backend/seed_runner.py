from app.core.database import AsyncSessionLocal
from app.modules.identity.seed import seed_identity_data
from app.modules.projects.seed import seed_projects
from app.modules.budgets.seed import seed_budget
from app.modules.site_operations.seed import seed_site_operations
import asyncio

async def main() -> None:
  async with AsyncSessionLocal() as session:
    print("Seeding identity data...")
    await seed_identity_data(session)
    
    print("Seeding projects and clients data...")
    await seed_projects(session)
    
    print("Seeding budgets and budget items data...")
    await seed_budget(session)
    
    print("Seeding site and operations data...")
    await seed_site_operations(session)
    
    print("All seeders completed")

if __name__ == "__main__":
  asyncio.run(main())