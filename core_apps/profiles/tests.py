import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from django.db.models import Avg

from core_apps.profiles.models import Profile
from core_apps.ratings.models import Rating

User = get_user_model()


@pytest.mark.django_db
class TestProfileModel:
    def test_profile_creation(self, user_with_profile):
        profile = user_with_profile.profile
        assert profile.user == user_with_profile
        assert profile.gender == Profile.Gender.MALE
        assert profile.occupation == Profile.Occupation.TENANT

    def test_profile_str(self, user_with_profile):
        profile = user_with_profile.profile
        assert str(profile) == "Test's Profile"

    def test_profile_slug_auto_generation(self, user_with_profile):
        profile = user_with_profile.profile
        assert profile.slug == "testuser"

    def test_profile_is_banned_false(self, user_with_profile):
        profile = user_with_profile.profile
        assert not profile.is_banned

    def test_profile_is_banned_true(self, user_with_profile):
        profile = user_with_profile.profile
        profile.report_count = 5
        profile.save()
        assert profile.is_banned

    def test_profile_update_reputation(self, user_with_profile):
        profile = user_with_profile.profile
        profile.report_count = 2
        profile.save()
        assert profile.reputation == 60  # 100 - (2 * 20)

    def test_profile_reputation_minimum_zero(self, user_with_profile):
        profile = user_with_profile.profile
        profile.report_count = 10
        profile.save()
        assert profile.reputation == 0

    def test_profile_get_average_rating_no_ratings(self, user_with_profile):
        profile = user_with_profile.profile
        assert profile.get_average_rating() == 0.0

    def test_profile_get_average_rating_with_ratings(self, user_with_profile, technician_user):
        profile = user_with_profile.profile
        Rating.objects.create(
            rated_user=user_with_profile,
            rating_user=technician_user,
            rating=4,
        )
        Rating.objects.create(
            rated_user=user_with_profile,
            rating_user=technician_user,
            rating=5,
        )
        assert profile.get_average_rating() == 4.5


@pytest.mark.django_db
class TestProfileViews:
    def test_profile_list_view(self, api_client):
        response = api_client.get("/api/v1/profiles/all/")
        assert response.status_code == status.HTTP_200_OK
        assert "profiles" in response.data

    def test_profile_list_view_search(self, api_client, user_with_profile):
        response = api_client.get("/api/v1/profiles/all/?search=test")
        assert response.status_code == status.HTTP_200_OK

    def test_profile_list_view_filter_occupation(self, api_client, user_with_profile):
        response = api_client.get("/api/v1/profiles/all/?occupation=tenant")
        assert response.status_code == status.HTTP_200_OK

    def test_profile_detail_view(self, authenticated_client, user_with_profile):
        response = authenticated_client.get("/api/v1/profiles/user/my-profile/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"

    def test_profile_detail_view_unauthenticated(self, api_client):
        response = api_client.get("/api/v1/profiles/user/my-profile/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_profile_update_view(self, authenticated_client, user_with_profile):
        data = {
            "first_name": "Updated",
            "last_name": "Name",
            "username": "updateduser",
            "gender": "female",
            "bio": "Updated bio",
        }
        response = authenticated_client.patch("/api/v1/profiles/user/update/", data)
        assert response.status_code == status.HTTP_200_OK
        user_with_profile.refresh_from_db()
        assert user_with_profile.first_name == "Updated"

    def test_profile_update_view_unauthenticated(self, api_client):
        data = {"first_name": "Updated"}
        response = api_client.patch("/api/v1/profiles/user/update/", data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_non_tenant_profile_list_view(self, api_client, technician_user):
        response = api_client.get("/api/v1/profiles/non-tenant-profiles/")
        assert response.status_code == status.HTTP_200_OK
        assert "non_tenant_profiles" in response.data


@pytest.mark.django_db
class TestProfileSerializers:
    def test_profile_serializer(self, user_with_profile):
        from core_apps.profiles.serializers import ProfileSerializer
        serializer = ProfileSerializer(user_with_profile.profile)
        data = serializer.data
        assert data["username"] == "testuser"
        assert data["first_name"] == "Test"
        assert "average_rating" in data

    def test_update_profile_serializer(self, user_with_profile):
        from core_apps.profiles.serializers import UpdateProfileSerializer
        data = {
            "first_name": "New",
            "last_name": "Name",
            "username": "newname",
            "gender": "female",
        }
        serializer = UpdateProfileSerializer(
            user_with_profile.profile, data=data, partial=True
        )
        assert serializer.is_valid()
        serializer.save()
        user_with_profile.refresh_from_db()
        assert user_with_profile.first_name == "New"
