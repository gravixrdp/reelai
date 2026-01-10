
import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime
import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.instagram_service import InstagramService
from app.models.instagram import InstagramAccount, InstagramAccountStatus

class TestInstagramVerification(unittest.TestCase):
    def setUp(self):
        self.mock_db = MagicMock()
        self.service = InstagramService(self.mock_db)
        
        # Setup a mock account
        self.account = InstagramAccount(
            id="test-id",
            username="test_user",
            status=InstagramAccountStatus.PENDING_VERIFICATION,
            verification_attempts=0,
            access_token="fake_token",
            instagram_user_id="fake_uid"
        )
        self.service.get_account = MagicMock(return_value=self.account)

    @patch('app.services.instagram_service.requests.post')
    def test_verify_success(self, mock_post):
        """Test successful verification flow"""
        # Mock API responses
        # 1. Create Container
        mock_response_container = MagicMock()
        mock_response_container.json.return_value = {"id": "container_123"}
        mock_response_container.raise_for_status.return_value = None
        
        # 2. Publish Container
        mock_response_publish = MagicMock()
        mock_response_publish.json.return_value = {"id": "media_123"}
        mock_response_publish.raise_for_status.return_value = None
        
        mock_post.side_effect = [mock_response_container, mock_response_publish]
        
        # Execute
        updated_account = self.service.verify_connection("test-id")
        
        # Verify
        self.assertEqual(updated_account.status, InstagramAccountStatus.CONNECTED)
        self.assertTrue(updated_account.verified_by_post)
        self.assertIsNotNone(updated_account.connected_at)
        # self.assertEqual(updated_account.verification_attempts, 0) # Depends on implementation choice

    @patch('app.services.instagram_service.requests.post')
    def test_verify_failure_api(self, mock_post):
        """Test verification failure handling"""
        # Mock API failure
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = Exception("API Error")
        mock_post.return_value = mock_response
        
        # Execute
        try:
             self.service.verify_connection("test-id")
        except ValueError:
             pass # Service raises ValueError on failure now
        
        # Verify
        self.assertEqual(self.account.status, InstagramAccountStatus.VERIFICATION_FAILED)
        self.assertEqual(self.account.verification_attempts, 1)

    def test_max_attempts(self):
        """Test max attempts blocking"""
        self.account.verification_attempts = 3
        
        with self.assertRaises(ValueError) as cm:
            self.service.verify_connection("test-id")
            
        self.assertIn("Maximum verification attempts", str(cm.exception))

if __name__ == '__main__':
    unittest.main()
