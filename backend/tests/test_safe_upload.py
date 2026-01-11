
import unittest
from unittest.mock import patch, MagicMock
from app.services.instagram_publisher import InstagramPublisher

class TestSafeUpload(unittest.TestCase):
    def test_upload_flow(self):
        print("\nStarting Safe Mode Upload Test...")
        
        # Test Data
        fake_token = "EAAZAzZCTeGSbsBQboYINAfJIRnPROIIFLWllIYzwPRgGO4QFu3RTxWqqKDZBJymwUZBriTg8PYI7sp5EttBZBDqd4DkELClYsPNvljnYJwvgPrMS7H1mVF4xD5ZCSG3sr1Nm68QZAwIV3senTFduMZB7JQnt0ViZAZBV290wVnQZCysJp0xAPrr0hCamdShR1ZC6jAZDZD"
        fake_user_id = "17841478090413863"
        video_url = "https://example.com/reel.mp4"
        caption = "Test Reel #Gravix"
        
        publisher = InstagramPublisher()
        
        with patch('requests.post') as mock_post:
            # Mock Responses
            # 1. Upload Media
            mock_upload_resp = MagicMock()
            mock_upload_resp.json.return_value = {"id": "media_123"}
            mock_upload_resp.raise_for_status.return_value = None
            
            # 2. Publish Media
            mock_publish_resp = MagicMock()
            mock_publish_resp.json.return_value = {"id": "reel_456"}
            mock_publish_resp.raise_for_status.return_value = None
            
            # Set side effects (sequence of returns)
            mock_post.side_effect = [mock_upload_resp, mock_publish_resp]
            
            # Execute
            result = publisher.upload_and_publish(
                ig_user_id=fake_user_id,
                video_url=video_url,
                caption=caption,
                access_token=fake_token
            )
            
            # Validate
            print("Result:", result)
            self.assertTrue(result['success'])
            self.assertEqual(result['reel_id'], "reel_456")
            
            # Assert Calls
            calls = mock_post.call_args_list
            self.assertEqual(len(calls), 2)
            
            # Check Upload Payload
            upload_call = calls[0]
            upload_payload = upload_call[1]['json']
            self.assertEqual(upload_payload['video_url'], video_url)
            self.assertEqual(upload_payload['access_token'], fake_token)
            
            # Check Publish Payload
            publish_call = calls[1]
            publish_payload = publish_call[1]['json']
            self.assertEqual(publish_payload['creation_id'], "media_123")
            self.assertEqual(publish_payload['access_token'], fake_token)
            
            print("SUCCESS: Upload flow mocked and validated correctly.")

if __name__ == '__main__':
    unittest.main()
