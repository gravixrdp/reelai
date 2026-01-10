from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    # App
    app_name: str = "GRAVIXAI Backend"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # API
    allowed_origins: Union[str, List[str]] = ["*"]

    # Database
    database_url: str

    # Facebook / Instagram
    facebook_app_id: str = ""
    facebook_app_secret: str = ""
    facebook_redirect_uri: str = ""
    facebook_api_version: str = "v19.0"
    instagram_graph_api_version: str = "v19.0"

    # Gemini
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-pro"

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Logging
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"  # Allow extra fields in .env
    )

def get_settings():
    return Settings()
