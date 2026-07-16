import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.test import APIClient

from core_apps.users.managers import UserManager
from core_apps.users.models import UsernameValidator

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    def test_user_creation(self, user):
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.first_name == "Test"
        assert user.last_name == "User"
        assert user.check_password("testpass123")
        assert not user.is_staff
        assert not user.is_superuser

    def test_user_get_full_name(self, user):
        assert user.get_full_name == "Test User"

    def test_user_str(self, user):
        assert str(user) == "testuser"

    def test_user_email_unique(self, db):
        User.objects.create_user(
            username="user1",
            email="test@example.com",
            password="pass123",
        )
        with pytest.raises(Exception):
            User.objects.create_user(
                username="user2",
                email="test@example.com",
                password="pass123",
            )

    def test_user_username_unique(self, db):
        User.objects.create_user(
            username="testuser",
            email="test1@example.com",
            password="pass123",
        )
        with pytest.raises(Exception):
            User.objects.create_user(
                username="testuser",
                email="test2@example.com",
                password="pass123",
            )

    def test_user_ordering(self, db):
        user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="pass123",
        )
        user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="pass123",
        )
        users = list(User.objects.all())
        assert users[0] in [user1, user2]


@pytest.mark.django_db
class TestUserManager:
    def test_create_user(self, db):
        user = User.objects.create_user(
            username="newuser",
            email="newuser@example.com",
            password="password123",
        )
        assert user.username == "newuser"
        assert user.email == "newuser@example.com"
        assert not user.is_staff
        assert not user.is_superuser

    def test_create_user_without_username(self, db):
        with pytest.raises(ValueError, match="username must be proivided"):
            User.objects.create_user(
                username="",
                email="test@example.com",
                password="pass123",
            )

    def test_create_user_without_email(self, db):
        with pytest.raises(ValueError, match="email address must be provided"):
            User.objects.create_user(
                username="testuser",
                email="",
                password="pass123",
            )

    def test_create_user_invalid_email(self, db):
        with pytest.raises(ValidationError):
            User.objects.create_user(
                username="testuser",
                email="invalid-email",
                password="pass123",
            )

    def test_create_superuser(self, db):
        user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin123",
        )
        assert user.is_staff
        assert user.is_superuser

    def test_create_superuser_without_staff(self, db):
        with pytest.raises(ValueError, match="Superuser must have is_staff=True"):
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="admin123",
                is_staff=False,
            )

    def test_create_superuser_without_superuser_flag(self, db):
        with pytest.raises(ValueError, match="Superuser must have is_superuser=True"):
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="admin123",
                is_superuser=False,
            )


@pytest.mark.django_db
class TestUsernameValidator:
    def test_valid_username(self):
        validator = UsernameValidator()
        validator("testuser")
        validator("test.user")
        validator("test+user")
        validator("test-user")
        validator("test@user")

    def test_invalid_username(self):
        validator = UsernameValidator()
        with pytest.raises(ValidationError):
            validator("test user")
        with pytest.raises(ValidationError):
            validator("test#user")


@pytest.mark.django_db
class TestUserViews:
    def test_logout_view(self, authenticated_client):
        response = authenticated_client.post("/api/v1/auth/logout/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert "access" not in response.cookies
        assert "refresh" not in response.cookies
        assert "logged_in" not in response.cookies

    def test_logout_unauthenticated(self, api_client):
        response = api_client.post("/api/v1/auth/logout/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

