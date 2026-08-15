import structlog
import asyncio

logger = structlog.get_logger()

async def main():
  logger.info("worker.startup", msg = "Worker process started (stub)")
  while True:
    await asyncio.sleep(60)
    logger.info("worker.heartbeat", msg = "Worker alive")

if __name__ == "__main__":
  asyncio.run(main())