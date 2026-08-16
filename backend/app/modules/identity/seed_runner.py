from app.core.database import AsyncSessionLocal
from app.modules.identity.seed import seed_identity_data
import asyncio

async def main() -> None:
  async with AsyncSessionLocal() as session:
    await seed_identity_data(session)

if __name__ == "__main__":
  asyncio.run(main())