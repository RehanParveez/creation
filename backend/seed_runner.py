from app.core.database import AsyncSessionLocal
from app.modules.identity.seed import seed_identity_data
from app.modules.projects.seed import seed_clients_and_projects
import asyncio

async def main() -> None:
  async with AsyncSessionLocal() as session:
    print("Seeding identity data...")
    await seed_identity_data(session)
    
    print("Seeding projects and clients data...")
    await seed_clients_and_projects(session)
    
    print("All seeders completed")

if __name__ == "__main__":
  asyncio.run(main())