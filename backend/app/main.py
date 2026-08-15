from app.core.config import get_settings
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.exceptions import APIError, TameerException
import uuid
from fastapi.responses import JSONResponse
from app.api.v1.router import api_router

settings = get_settings()
logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
  logger.info("construction.startup", env=settings.app_env)
  yield
  logger.info("construction.shutdown")

app = FastAPI(
  title = "Creation",
  description = "Construction project control platform",
  version = "0.1.0",
  docs_url = "/docs" if settings.app_debug else None,
  redoc_url = "/redoc" if settings.app_debug else None,
  lifespan=lifespan,
)
app.add_middleware(CORSMiddleware, allow_origins=settings.backend_cors_origins, allow_credentials=True,
  allow_methods=["*"], allow_headers=["*"],
)

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
  request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
  request.state.request_id = request_id
  response = await call_next(request)
  response.headers["x-request-id"] = request_id

  return response

@app.exception_handler(TameerException)
async def tameer_exception_handler(request: Request, exc: TameerException):
  request_id = getattr(request.state, "request_id", "")
  return JSONResponse(
    status_code=exc.status_code,
    content=APIError(
      code=exc.code,
      message=exc.message,
      details=exc.details,
      request_id=request_id,
    ).model_dump(),
  )

@app.get("/health", tags=["health"])
async def health():
  return {"status": "ok"}

@app.get("/health/ready", tags=["health"])
async def ready():
  return {"status": "ready", "checks": {"app": "ok"}}

app.include_router(api_router, prefix = "/api/v1")