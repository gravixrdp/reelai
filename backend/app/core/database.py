import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from app.models import Base
from app.core.config import get_settings

settings = get_settings()

# Database URL
if "sqlite" in settings.database_url:
    # SQLite configuration
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=settings.debug
    )
else:
    # PostgreSQL configuration
    engine = create_engine(
        settings.database_url,
        echo=settings.debug,
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    
    # Seed Admin User
    try:
        db = SessionLocal()
        from app.services.user_service import UserService
        from app.schemas.user import UserCreate
        
        user_service = UserService(db)
        admin_email = "gravixrdp@gmail.com" # provided by user
        
        existing = user_service.get_user_by_email(admin_email)
        if not existing:
            admin_data = UserCreate(
                email=admin_email,
                username="admin", 
                password="@VGahir444", # provided by user
                full_name="System Admin"
            )
            user = user_service.create_user(admin_data)
            user.is_superuser = True
            db.commit()
            print(f"✓ Admin user created: {admin_email}")
        else:
            print(f"✓ Admin user already exists: {admin_email}")
            
        db.close()
    except Exception as e:
        print(f"⚠ Error seeding admin: {e}")

    print("✓ Database tables created")
