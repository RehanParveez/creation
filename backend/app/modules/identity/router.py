from __future__ import annotations
from fastapi import APIRouter, status, Request, Depends
from app.modules.identity.schemas import AuthResponse, RegisterRequest, LoginRequest, TokenResponse, RefreshRequest, MessageResponse, ForgotPasswordRequest, ResetPasswordRequest, MeResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.identity.service import IdentityService
from app.modules.identity.models import User
from app.dependencies.auth import get_current_user
from app.modules.identity.permissions import get_user_permission_codes

router = APIRouter()

@router.post(
  "/register",
  response_model=AuthResponse,
  status_code=status.HTTP_201_CREATED,
)
async def register(
  data: RegisterRequest,
  request: Request,
  db: AsyncSession = Depends(get_db),
) -> AuthResponse:
  service = IdentityService(db)

  user = await service.register(data)

  return await service.authenticate(
    LoginRequest(
      email=data.email,
      password=data.password,
    ),
    user_agent=request.headers.get("user-agent"),
    ip_address=request.client.host if request.client else None,
  )

@router.post(
  "/login",
  response_model=AuthResponse,
)
async def login(
  data: LoginRequest,
  request: Request,
  db: AsyncSession = Depends(get_db),
) -> AuthResponse:
  service = IdentityService(db)

  return await service.authenticate(
    data,
    user_agent=request.headers.get("user-agent"),
    ip_address=request.client.host if request.client else None,
  )

@router.post(
  "/refresh",
  response_model=TokenResponse,
)
async def refresh(
  data: RefreshRequest,
  request: Request,
  db: AsyncSession = Depends(get_db),
) -> TokenResponse:
  service = IdentityService(db)

  return await service.refresh(
    data,
    user_agent=request.headers.get("user-agent"),
    ip_address=request.client.host if request.client else None,
  )

@router.post(
  "/logout",
  response_model=MessageResponse,
)
async def logout(
  data: RefreshRequest,
  db: AsyncSession = Depends(get_db),
) -> MessageResponse:
  await IdentityService(db).logout(data)

  return MessageResponse(
    message = "Successfully signed out."
  )

@router.post(
  "/forgot-password",
  response_model=MessageResponse,
)
async def forgot_password(
  data: ForgotPasswordRequest,
  db: AsyncSession = Depends(get_db),
) -> MessageResponse:
  token = await IdentityService(db).request_password_reset(
    str(data.email)
  )

  _ = token

  return MessageResponse(
    message=(
      "If an account exists for that email, "
      "password recovery instructions have been issued."
    )
  )

@router.post(
  "/reset-password",
  response_model=MessageResponse,
)
async def reset_password(
  data: ResetPasswordRequest,
  db: AsyncSession = Depends(get_db),
) -> MessageResponse:
  await IdentityService(db).reset_password(data)

  return MessageResponse(
    message = "Password has been reset successfully."
  )

@router.get(
  "/me",
  response_model=MeResponse,
)
async def me(
  current_user: User = Depends(get_current_user),
) -> MeResponse:
  return MeResponse(
    id=current_user.id,
    email=current_user.email,
    first_name=current_user.first_name,
    last_name=current_user.last_name,
    is_active=current_user.is_active,
    is_verified=current_user.is_verified,
    last_login_at=current_user.last_login_at,
    permissions=sorted(
      get_user_permission_codes(current_user)
    ),
    roles=sorted(
      role.name
      for role in current_user.roles
    ),
  )