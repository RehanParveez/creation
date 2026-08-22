from fastapi import APIRouter
from app.api.v1.endpoints import health
from app.modules.identity.router import router as identity_router
from app.modules.organizations.router import router as organizations_router
from app.modules.projects.router import router as projects_router
from app.modules.budgets.router import router as budget_router
from app.modules.site_operations.router import router as site_operations_router
from app.modules.materials_requests.router import router as materials_requests_router

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
api_router.include_router(projects_router,
)
api_router.include_router(budget_router, prefix = "/api/v1/budgets", tags=["Budgets"],
)
api_router.include_router(site_operations_router,
)
api_router.include_router(materials_requests_router, prefix = "/material-requisitions", tags=["Material Requisitions"],
)