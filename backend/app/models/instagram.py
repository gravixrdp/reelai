import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base

class InstagramAccountStatus(str, enum.Enum):
    PENDING_VERIFICATION = "pending_verification"
    CONNECTED = "connected"
    VERIFICATION_FAILED = "verification_failed"
    INACTIVE = "inactive"

class InstagramAccount(Base):
    __tablename__ = "instagram_accounts"
    __table_args__ = {'extend_existing': True}

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)  # Link to user
    username = Column(String, unique=True, index=True, nullable=False)
    label = Column(String, nullable=True)
    
    # Status tracking
    status = Column(Enum(InstagramAccountStatus), default=InstagramAccountStatus.PENDING_VERIFICATION, nullable=False)
    
    # Auth details (Encrypt in production - stored as string for this implementation per prompt constraints)
    access_token = Column(String, nullable=True)
    instagram_user_id = Column(String, nullable=True)
    
    # Verification Meta
    connected_at = Column(DateTime, nullable=True)
    last_verified_at = Column(DateTime, nullable=True)
    verification_attempts = Column(Integer, default=0)
    last_error = Column(String, nullable=True)
    verified_by_post = Column(Boolean, default=False)  # True if verified via test post
    last_verification_error = Column(String, nullable=True)  # Last error during verification
    
    # Feature Flags
    automation_enabled = Column(Boolean, default=False)
    device_bound = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="instagram_accounts")
    schedules = relationship("ReelSchedule", back_populates="instagram_account", cascade="all, delete-orphan")
