from sqlalchemy.orm import Session
from app.models.instagram import InstagramAccount, InstagramAccountStatus
from app.schemas.instagram import InstagramAccountCreate, InstagramAccountUpdate
from datetime import datetime
import requests
from typing import Optional

class InstagramService:
    def __init__(self, db: Session):
        self.db = db

    def create_account(self, account_data: InstagramAccountCreate) -> InstagramAccount:
        """
        Create Instagram account.
        If instagram_user_id is not provided, we'll try to fetch it using the access token.
        """
        instagram_user_id = account_data.instagram_user_id
        
        # If no Instagram user ID provided and we have an access token, try to fetch it from the API
        if not instagram_user_id and account_data.access_token:
            try:
                # Get the user's Facebook pages
                pages_url = "https://graph.facebook.com/v19.0/me/accounts"
                params = {"access_token": account_data.access_token}
                response = requests.get(pages_url, params=params)
                response.raise_for_status()
                
                pages_data = response.json()
                if not pages_data.get("data"):
                    raise ValueError("No Facebook pages found for this access token")
                
                # Get the first page (you might want to let user choose)
                page_id = pages_data["data"][0]["id"]
                page_token = pages_data["data"][0]["access_token"]
                
                # Get Instagram Business Account ID from the page
                ig_url = f"https://graph.facebook.com/v19.0/{page_id}"
                ig_params = {
                    "fields": "instagram_business_account",
                    "access_token": page_token
                }
                ig_response = requests.get(ig_url, params=ig_params)
                ig_response.raise_for_status()
                
                ig_data = ig_response.json()
                instagram_user_id = ig_data.get("instagram_business_account", {}).get("id")
                
                if not instagram_user_id:
                    raise ValueError("No Instagram Business Account linked to this Facebook page")
                    
            except Exception as e:
                # Don't fail account creation if we can't fetch the ID
                # User can provide it later during verification
                pass
        
        db_account = InstagramAccount(
            user_id=1,  # TODO: Get from authenticated user
            username=account_data.username,
            label=account_data.label,
            access_token=account_data.access_token,  # Can be None
            instagram_user_id=instagram_user_id,
            status=InstagramAccountStatus.PENDING_VERIFICATION
        )
        self.db.add(db_account)
        self.db.commit()
        self.db.refresh(db_account)
        return db_account

    def get_account(self, account_id: str) -> Optional[InstagramAccount]:
        return self.db.query(InstagramAccount).filter(InstagramAccount.id == account_id).first()

    def get_all_accounts(self) -> list[InstagramAccount]:
        return self.db.query(InstagramAccount).all()

    def verify_connection(self, account_id: str, force: bool = False) -> InstagramAccount:
        account = self.get_account(account_id)
        if not account:
            raise ValueError("Account not found")
        
        # Rate limit check (simple version)
        if account.verification_attempts >= 3 and not force:
             # Check if last attempt was recent, logic can be added here
             pass 

        # The Prompt Requires publishing a REAL image.
        # We will use a reliable public image URL for the test.
        # Ideally, this should be a "System" asset hosted on our own server or public bucket.
        # For this implementation, we'll use a placeholder.
        TEST_IMAGE_URL = "https://placehold.co/1080x1080/000000/FFFFFF/png?text=Reels+Studio+Test"
        CAPTION = "Instagram connection test via Reels Studio"
        
        # 1. Upload Media
        upload_url = f"https://graph.facebook.com/v19.0/{account.instagram_user_id}/media"
        params = {
            "image_url": TEST_IMAGE_URL,
            "caption": CAPTION,
            "access_token": account.access_token
        }
        
        try:
            # Step 1: Create Container
            response = requests.post(upload_url, params=params)
            response.raise_for_status()
            container_id = response.json().get("id")
            
            # Step 2: Publish Container
            publish_url = f"https://graph.facebook.com/v19.0/{account.instagram_user_id}/media_publish"
            publish_params = {
                "creation_id": container_id,
                "access_token": account.access_token
            }
            
            pub_response = requests.post(publish_url, params=publish_params)
            pub_response.raise_for_status()
            
            # Success!
            account.status = InstagramAccountStatus.CONNECTED
            account.connected_at = datetime.utcnow()
            account.last_verified_at = datetime.utcnow()
            account.verification_attempts = 0 # Reset on success
            account.last_error = None
            
        except requests.exceptions.HTTPError as e:
            # Failure
            account.status = InstagramAccountStatus.VERIFICATION_FAILED
            account.verification_attempts += 1
            account.last_verified_at = datetime.utcnow()
            # Capture error details safely
            try:
                error_detail = e.response.json().get("error", {}).get("message", str(e))
            except:
                error_detail = str(e)
            account.last_error = error_detail

        except Exception as e:
            # Generic Failure
            account.status = InstagramAccountStatus.VERIFICATION_FAILED
            account.verification_attempts += 1
            account.last_verified_at = datetime.utcnow()
            account.last_error = str(e)

        self.db.commit()
        self.db.refresh(account)
        return account

    def delete_account(self, account_id: str):
        # Soft delete logic requested? Prompt says "Soft delete", but generally for 'delete' endpoint we might just mark inactive 
        # unless strict data retention policy. Let's mark inactive for now as per schema or actually delete row if we want to clean up.
        # Schema has "INACTIVE" status.
        account = self.get_account(account_id)
        if account:
            account.status = InstagramAccountStatus.INACTIVE
            self.db.commit()
