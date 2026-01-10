
import asyncio
import logging
from app.db.base import Base
from app.core.database import engine, SessionLocal
from app.services.instagram_verifier import InstagramVerifier
from app.models.instagram import InstagramAccount, InstagramAccountStatus

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_user_prod():
    db = SessionLocal()
    try:
        # User Credentials
        IG_USER_ID = "17841478090413863"
        # Using the token found in the frontend code history
        ACCESS_TOKEN = "EAAZAzZCTeGSbsBQboYINAfJIRnPROIIFLWllIYzwPRgGO4QFu3RTxWqqKDZBJymwUZBriTg8PYI7sp5EttBZBDqd4DkELClYsPNvljnYJwvgPrMS7H1mVF4xD5ZCSG3sr1Nm68QZAwIV3senTFduMZB7JQnt0ViZAZBV290wVnQZCysJp0xAPrr0hCamdShR1ZC6jAZDZD"
        USERNAME = "gravi_xshow" # From previous context

        print(f"--- Starting Live Verification Test for {USERNAME} ---")

        # 1. Update or Create the account in DB
        account = db.query(InstagramAccount).filter(InstagramAccount.username == USERNAME).first()
        if not account:
            print("Creating new account record...")
            account = InstagramAccount(
                id="test-prod-1",
                username=USERNAME,
                status=InstagramAccountStatus.PENDING_VERIFICATION,
                verification_attempts=0
            )
            db.add(account)
        else:
            print("Resetting existing account for test...")
            account.status = InstagramAccountStatus.PENDING_VERIFICATION
            account.verification_attempts = 0 # Reset attempts to allow test
            account.verified_by_post = False
        
        # Save credentials (temporarily or as per schema)
        account.instagram_user_id = IG_USER_ID
        account.access_token = ACCESS_TOKEN
        db.commit()
        db.refresh(account)

        # 2. Run Verification
        verifier = InstagramVerifier()
        print("Triggering verification service...")
        
        success, message = await verifier.verify_account(
            account=account,
            ig_user_id=IG_USER_ID,
            access_token=ACCESS_TOKEN,
            db=db
        )

        print(f"\n--- Result: {'SUCCESS' if success else 'FAILURE'} ---")
        print(f"Message: {message}")
        print(f"Final Status: {account.status}")
        
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(verify_user_prod())
