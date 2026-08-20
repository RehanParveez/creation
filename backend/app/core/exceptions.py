from typing import Any, Dict, Optional
from pydantic import BaseModel

class APIError(BaseModel):
  code: str
  message: str
  details: Optional[Dict[str, Any]] = None
  request_id: Optional[str] = None

class TameerException(Exception):
  def __init__(
    self,
    code: str,
    message: str,
    status_code: int = 400,
    details: Optional[Dict[str, Any]] = None,
  ):
    self.code = code
    self.message = message
    self.status_code = status_code
    self.details = details or {}
    super().__init__(message)

class NotFoundException(TameerException):
  def __init__(self, resource: str = "Resource"):
    super().__init__(
      code = "RESOURCE_NOT_FOUND",
      message=f"{resource} not found.",
      status_code=404,
    )
    
class ConflictException(TameerException):
  def __init__(
    self,
    message: str = "Resource conflict.",
    details: Optional[Dict[str, Any]] = None,
  ):
    super().__init__(
      code="CONFLICT",
      message=message,
      status_code=409,
      details=details,
    )

class ForbiddenException(TameerException):
  def __init__(self, message: str = "Access denied."):
    super().__init__(
      code="FORBIDDEN",
      message=message,
      status_code=403,
    )

class ValidationException(TameerException):
  def __init__(
    self,
    message: str = "Validation failed.",
    details: Optional[Dict[str, Any]] = None,
  ):
    super().__init__(
      code = "VALIDATION_ERROR",
      message=message,
      status_code=422,
      details=details,
    )