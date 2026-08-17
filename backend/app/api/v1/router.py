from fastapi import APIRouter
from app.api.v1.endpoints import health
from app.modules.identity.router import router as identity_router
from app.modules.organizations.router import router as organizations_router

api_router = APIRouter()

api_router.include_router(
  health.router,
  prefix = "/health",
  tags = ["health"],
)
api_router.include_router(identity_router, prefix = "/auth", tags=["authentication"],
)
api_router.include_router(organizations_router,
)