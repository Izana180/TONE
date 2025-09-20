import pytest
from fastapi.testclient import TestClient
from datetime import date
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session
from handler.main import app
from models import UserCreate
from infrastructure.models.user_model import User as UserModel

client = TestClient(app)

class TestUsersEndpoint:
    """ユーザー登録エンドポイントの単体テスト"""

    def setup_method(self):
        """各テストメソッドの前に実行されるセットアップ"""
        self.valid_user_data = {
            "name": "テストユーザー",
            "email": "test@example.com",
            "password": "TestPassword123!",
            "birth_date": "1990-01-01"
        }

    def test_create_user_success(self):
        """正常なユーザー登録のテスト"""
        with patch('handler.main.create_new_user') as mock_create_user:
            # create_new_userの返り値を置換
            mock_user_response = {
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "テストユーザー",
                    "email": "test@example.com",
                    "birth_date": "1990-01-01",
                    "created_at": "2025-01-19T12:00:00Z"
                },
                "token": {
                    "token": "mock_jwt_token",
                    "token_type": "bearer"
                }
            }
            mock_create_user.return_value = mock_user_response

            # APIリクエストを実行
            response = client.post("/users", json=self.valid_user_data)

            # レスポンスの検証
            assert response.status_code == 201
            assert response.json() == mock_user_response
            mock_create_user.assert_called_once()

    def test_create_user_validation_error_name_too_short(self):
        """ユーザー名が短すぎる場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["name"] = "ab"  # 3文字未満

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "name" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_invalid_email(self):
        """無効なメールアドレス形式のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["email"] = "invalid-email"  # 無効な形式

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "email" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_password_too_short(self):
        """パスワードが短すぎる場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["password"] = "123"  # 10文字未満

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "password" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_password_no_uppercase(self):
        """パスワードに英大文字がない場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["password"] = "testpassword123!"  # 英大文字なし

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "password" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_password_no_lowercase(self):
        """パスワードに英小文字がない場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["password"] = "TESTPASSWORD123!"  # 英小文字なし

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "password" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_password_no_digit(self):
        """パスワードに数字がない場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["password"] = "TestPassword!"  # 数字なし

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "password" in response_data["detail"]["error"]["reasons"]

    def test_create_user_validation_error_password_no_special_char(self):
        """パスワードに記号がない場合のバリデーションエラーテスト"""
        invalid_data = self.valid_user_data.copy()
        invalid_data["password"] = "TestPassword123"  # 記号なし

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert response_data["detail"]["error"]["code"] == "VALIDATION_ERROR"
        assert "password" in response_data["detail"]["error"]["reasons"]

    def test_create_user_missing_required_fields(self):
        """必須フィールドが不足している場合のテスト"""
        # nameフィールドを削除
        invalid_data = {
            "email": "test@example.com",
            "password": "TestPassword123!"
        }

        response = client.post("/users", json=invalid_data)

        assert response.status_code == 422
        response_data = response.json()
        assert "error" in response_data["detail"]
        assert "name" in response_data["detail"]["error"]["reasons"]

    def test_create_user_without_birth_date(self):
        """生年月日なしでの正常なユーザー登録テスト"""
        user_data_without_birth_date = {
            "name": "テストユーザー",
            "email": "test2@example.com",
            "password": "TestPassword123!"
        }

        with patch('handler.main.create_new_user') as mock_create_user:
            mock_user_response = {
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "name": "テストユーザー",
                    "email": "test2@example.com",
                    "birth_date": None,
                    "created_at": "2025-01-19T12:00:00Z"
                },
                "token": {
                    "token": "mock_jwt_token",
                    "token_type": "bearer"
                }
            }
            mock_create_user.return_value = mock_user_response

            response = client.post("/users", json=user_data_without_birth_date)

            assert response.status_code == 201
            assert response.json() == mock_user_response
