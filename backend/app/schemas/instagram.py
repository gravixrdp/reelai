from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional
from datetime import datetime

class InstagramAccountStatus(str, Enum):
    PENDING_VERIFICATION = "pending_verification"
    CONNECTED = "connected"
    VERIFICATION_FAILED = "verification_failed"
    INACTIVE = "inactive"

class InstagramAccountBase(BaseModel):
    username: str
    label: Optional[str] = None

class InstagramAccountCreate(InstagramAccountBase):
    access_token: Optional[str] = None
    instagram_user_id: Optional[str] = None

class InstagramAccountUpdate(BaseModel):
    label: Optional[str] = None
    automation_enabled: Optional[bool] = None
    status: Optional[InstagramAccountStatus] = None

class InstagramAccountResponse(InstagramAccountBase):
    id: str
    status: InstagramAccountStatus
    instagram_user_id: Optional[str] = None
    connected_at: Optional[datetime] = None
    last_verified_at: Optional[datetime] = None
    verification_attempts: int
    last_error: Optional[str] = None
    automation_enabled: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class VerifyAccountRequest(BaseModel):
    # Instagram credentials for verification
    ig_user_id: Optional[str] = None
    access_token: Optional[str] = None
    # Optional force flag to retry even if limited
    force: bool = False
