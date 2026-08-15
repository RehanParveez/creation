from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List
from pydantic import field_validator

class DatabaseSettings(BaseSettings):

  model_config = SettingsConfigDict(env_prefix = "POSTGRES_")
  user: str = "tameer"
  password: str = "change-me"
  db: str = "tameer"
  host: str = "postgres"
  port: int = 5432

  @property
  def async_url(self) -> str:
    return (
      f"postgresql+asyncpg://{self.user}:{self.password}"
      f"@{self.host}:{self.port}/{self.db}"
    )

class AuthSettings(BaseSettings):

  model_config = SettingsConfigDict(env_prefix = "JWT_")
  secret_key: str = "change-me"
  algorithm: str = "HS256"
  access_token_expire_minutes: int = 30
  refresh_token_expire_days: int = 14

class AISettings(BaseSettings):

  model_config = SettingsConfigDict(env_prefix = "AI_")
  ollama_base_url: str = "http://ollama:11434"
  ollama_model: str = "qwen2.5:7b-instruct"
  requests_per_minute: int = 10

class StorageSettings(BaseSettings):
  
  model_config = SettingsConfigDict(env_prefix = "OBJECT_STORAGE_")
  endpoint: str = "http://minio:9000"
  bucket: str = "tameer-attachments"
  access_key: str = "minioadmin"
  secret_key: str = "minioadmin"
  max_image_mb: int = 5
  max_pdf_mb: int = 10

class RateLimitSettings(BaseSettings):

  model_config = SettingsConfigDict(env_prefix = "RATE_LIMIT_")
  default: str = "100/minute"
  auth: str = "10/minute"
  ai: str = "10/minute"

class Settings(BaseSettings):

  model_config = SettingsConfigDict(env_file = ".env", env_file_encoding = "utf-8", extra = "ignore",
    )
  app_env: str = "development"
  app_debug: bool = True
  app_secret_key: str = "change-me"
  backend_cors_origins: List[str] = ["http://localhost:5093"]
  database: DatabaseSettings = DatabaseSettings()
  auth: AuthSettings = AuthSettings()
  ai: AISettings = AISettings()
  storage: StorageSettings = StorageSettings()
  rate_limit: RateLimitSettings = RateLimitSettings()
  redis_url: str = "redis://redis:6379/3"
  default_locale: str = "en"
  supported_locales: str = "en,ur"
  default_currency: str = "PKR"
  default_timezone: str = "Asia/Karachi"
  idempotency_key_ttl_hours: int = 24

  @field_validator("backend_cors_origins", mode = "before")
  @classmethod
  def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
    if isinstance(v, str) and v.startswith("["):
      import json
      return json.loads(v)
    if isinstance(v, list):
      return v
    return [v]

@lru_cache
def get_settings() -> Settings:
  return Settings()