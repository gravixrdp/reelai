from app.db.base import Base
from app.core.database import engine
from app.models.instagram import InstagramAccount

def migrate():
    print("Creating Instagram Verification tables...")
    Base.metadata.create_all(bind=engine)
    print("Done!")

if __name__ == "__main__":
    migrate()
