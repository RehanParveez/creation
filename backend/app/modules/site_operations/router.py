from __future__ import annotations
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.auth import get_current_user
from app.dependencies.deps import get_db
from app.dependencies.organization import get_current_organization_id, require_organization_permissions
from app.modules.identity.models import User
from app.modules.site_operations.permissions import (
  SITE_LOG_APPROVE,
  SITE_LOG_ATTACHMENT_CREATE,
  SITE_LOG_ATTACHMENT_DELETE,
  SITE_LOG_CREATE,
  SITE_LOG_ISSUE_CREATE,
  SITE_LOG_ISSUE_READ,
  SITE_LOG_ISSUE_RESOLVE,
  SITE_LOG_ISSUE_UPDATE,
  SITE_LOG_READ,
  SITE_LOG_RETURN,
  SITE_LOG_REVIEW,
  SITE_LOG_SUBMIT,
  SITE_LOG_UPDATE,
)
from app.modules.site_operations.schemas import SiteLogAttachmentCreate, SiteLogAttachmentRead, SiteLogCreate, SiteLogIssueCreate, SiteLogIssueRead, SiteLogIssueUpdate, SiteLogRead, SiteLogReturnRequest, SiteLogReviewRequest, SiteLogUpdate
from app.modules.site_operations.service import SiteOperationsService

router = APIRouter(
  prefix="/projects/{project_id}/site-logs",
  tags=["site-operations"],
)

@router.post(
  "",
  response_model=SiteLogRead,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_CREATE]
      )
    )
  ],
)
async def create_site_log(
  project_id: UUID,
  payload: SiteLogCreate,
  current_user: User = Depends(get_current_user),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.create_site_log(
    current_user,
    project_id,
    organization_id,
    payload,
  )

@router.get(
  "",
  response_model=list[SiteLogRead],
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_READ]
      )
    )
  ],
)
async def list_site_logs(
  project_id: UUID,
  skip: int = 0,
  limit: int = 100,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)
  return await service.list_site_logs(
    project_id,
    organization_id,
    skip,
    limit,
  )

@router.get(
  "/{site_log_id}",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_READ]
      )
    )
  ],
)
async def get_site_log(
  project_id: UUID,
  site_log_id: UUID,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.get_site_log(
    site_log_id,
    project_id,
    organization_id,
  )

@router.patch(
  "/{site_log_id}",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_UPDATE]
      )
    )
  ],
)
async def update_site_log(
  project_id: UUID,
  site_log_id: UUID,
  payload: SiteLogUpdate,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.update_site_log(
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.post(
  "/{site_log_id}/submit",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_SUBMIT]
      )
    )
  ],
)
async def submit_site_log(
  project_id: UUID,
  site_log_id: UUID,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)
  return await service.submit_site_log(
    site_log_id,
    project_id,
    organization_id,
  )

@router.post(
  "/{site_log_id}/review",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_REVIEW]
      )
    )
  ],
)
async def review_site_log(
  project_id: UUID,
  site_log_id: UUID,
  payload: SiteLogReviewRequest,
  current_user: User = Depends(get_current_user),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.review_site_log(
    current_user,
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.post(
  "/{site_log_id}/return",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_RETURN]
      )
    )
  ],
)
async def return_site_log(
  project_id: UUID,
  site_log_id: UUID,
  payload: SiteLogReturnRequest,
  current_user: User = Depends(get_current_user),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.return_site_log(
    current_user,
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.post(
  "/{site_log_id}/approve",
  response_model=SiteLogRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_APPROVE]
      )
    )
  ],
)
async def approve_site_log(
  project_id: UUID,
  site_log_id: UUID,
  current_user: User = Depends(get_current_user),
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.approve_site_log(
    current_user,
    site_log_id,
    project_id,
    organization_id,
  )

@router.get(
  "/{site_log_id}/issues",
  response_model=list[SiteLogIssueRead],
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ISSUE_READ]
      )
    )
  ],
)
async def list_issues(
  project_id: UUID,
  site_log_id: UUID,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)
  return await service.list_issues(
    site_log_id,
    project_id,
    organization_id,
  )

@router.post(
  "/{site_log_id}/issues",
  response_model=SiteLogIssueRead,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ISSUE_CREATE]
      )
    )
  ],
)
async def create_issue(
  project_id: UUID,
  site_log_id: UUID,
  payload: SiteLogIssueCreate,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)
  return await service.create_issue(
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.patch(
  "/{site_log_id}/issues/{issue_id}",
  response_model=SiteLogIssueRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ISSUE_UPDATE]
      )
    )
  ],
)
async def update_issue(
  project_id: UUID,
  site_log_id: UUID,
  issue_id: UUID,
  payload: SiteLogIssueUpdate,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)
  return await service.update_issue(
    issue_id,
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.post(
  "/{site_log_id}/issues/{issue_id}/resolve",
  response_model=SiteLogIssueRead,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ISSUE_RESOLVE]
      )
    )
  ],
)
async def resolve_issue(
  project_id: UUID,
  site_log_id: UUID,
  issue_id: UUID,
  resolution: str,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.resolve_issue(
    issue_id,
    site_log_id,
    project_id,
    organization_id,
    resolution,
  )

@router.get(
  "/{site_log_id}/attachments",
  response_model=list[SiteLogAttachmentRead],
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_READ]
      )
    )
  ],
)
async def list_attachments(
  project_id: UUID,
  site_log_id: UUID,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.list_attachments(
    site_log_id,
    project_id,
    organization_id,
  )

@router.post(
  "/{site_log_id}/attachments",
  response_model=SiteLogAttachmentRead,
  status_code=status.HTTP_201_CREATED,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ATTACHMENT_CREATE]
      )
    )
  ],
)
async def create_attachment(
  project_id: UUID,
  site_log_id: UUID,
  payload: SiteLogAttachmentCreate,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  return await service.create_attachment(
    site_log_id,
    project_id,
    organization_id,
    payload,
  )

@router.delete(
  "/{site_log_id}/attachments/{attachment_id}",
  status_code=status.HTTP_204_NO_CONTENT,
  dependencies=[
    Depends(
      require_organization_permissions(
        [SITE_LOG_ATTACHMENT_DELETE]
      )
    )
  ],
)
async def delete_attachment(
  project_id: UUID,
  site_log_id: UUID,
  attachment_id: UUID,
  organization_id: UUID = Depends(
    get_current_organization_id
  ),
  db: AsyncSession = Depends(get_db),
):
  service = SiteOperationsService(db)

  await service.delete_attachment(
    attachment_id,
    site_log_id,
    project_id,
    organization_id,
  )

  return None