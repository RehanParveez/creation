"""Health check endpoints under /api/v1/health."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def v1_health():
  """Versioned health check."""
  return {"status": "ok", "version": "v1"}