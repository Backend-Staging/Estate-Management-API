import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123",
        first_name="Test",
        last_name="User",
    )


@pytest.fixture
def user_with_profile(db):
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123",
        first_name="Test",
        last_name="User",
    )
    Profile.objects.create(
        user=user,
        gender=Profile.Gender.MALE,
        occupation=Profile.Occupation.TENANT,
    )
    return user


@pytest.fixture
def staff_user(db):
    user = User.objects.create_user(
        username="staffuser",
        email="staff@example.com",
        password="testpass123",
        first_name="Staff",
        last_name="User",
        is_staff=True,
    )
    Profile.objects.create(
        user=user,
        gender=Profile.Gender.MALE,
        occupation=Profile.Occupation.TENANT,
    )
    return user


@pytest.fixture
def superuser(db):
    user = User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="adminpass123",
        first_name="Admin",
        last_name="User",
    )
    Profile.objects.create(
        user=user,
        gender=Profile.Gender.MALE,
        occupation=Profile.Occupation.TENANT,
    )
    return user


@pytest.fixture
def technician_user(db):
    user = User.objects.create_user(
        username="technician",
        email="tech@example.com",
        password="testpass123",
        first_name="Tech",
        last_name="User",
    )
    Profile.objects.create(
        user=user,
        gender=Profile.Gender.MALE,
        occupation=Profile.Occupation.PLUMBER,
        role=Profile.Role.REPAIR,
    )
    return user


@pytest.fixture
def authenticated_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def staff_client(api_client, staff_user):
    api_client.force_authenticate(user=staff_user)
    return api_client


@pytest.fixture
def superuser_client(api_client, superuser):
    api_client.force_authenticate(user=superuser)
    return api_client

