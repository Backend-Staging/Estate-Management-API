import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

from core_apps.ratings.models import Rating
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestRatingModel:
    def test_rating_creation(self, user_with_profile, technician_user):
        rating = Rating.objects.create(
            rated_user=technician_user,
            rating_user=user_with_profile,
            rating=Rating.RatingChoices.FIVE,
            comment="Great work!",
        )
        assert rating.rated_user == technician_user
        assert rating.rating_user == user_with_profile
        assert rating.rating == 5
        assert rating.comment == "Great work!"

    def test_rating_str(self, user_with_profile, technician_user):
        rating = Rating.objects.create(
            rated_user=technician_user,
            rating_user=user_with_profile,
            rating=Rating.RatingChoices.FOUR,
        )
        assert "rates" in str(rating)
        assert str(rating.rating) in str(rating)


@pytest.mark.django_db
class TestRatingViews:
    def test_rating_create_view_tenant_to_technician(self, authenticated_client, user_with_profile, technician_user):
        data = {
            "rated_user_username": technician_user.username,
            "rating": 5,
            "comment": "Excellent service",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Rating.objects.filter(
            rated_user=technician_user,
            rating_user=user_with_profile,
        ).exists()

    def test_rating_create_view_self_rating(self, authenticated_client, user_with_profile):
        data = {
            "rated_user_username": user_with_profile.username,
            "rating": 5,
            "comment": "Self rating",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_rating_create_view_tenant_to_tenant(self, authenticated_client, user_with_profile):
        other_tenant = User.objects.create_user(
            username="othertenant",
            email="othertenant@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_tenant,
            occupation=Profile.Occupation.TENANT,
        )
        data = {
            "rated_user_username": other_tenant.username,
            "rating": 5,
            "comment": "Tenant rating",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_rating_create_view_technician_to_technician(self, authenticated_client, technician_user):
        other_technician = User.objects.create_user(
            username="othertech",
            email="othertech@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_technician,
            occupation=Profile.Occupation.ELECTRICIAN,
        )
        data = {
            "rated_user_username": other_technician.username,
            "rating": 5,
            "comment": "Tech rating",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_rating_create_view_user_not_found(self, authenticated_client, user_with_profile):
        data = {
            "rated_user_username": "nonexistent",
            "rating": 5,
            "comment": "Comment",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_rating_create_view_no_profile(self, authenticated_client, user_with_profile):
        user_no_profile = User.objects.create_user(
            username="noprofile",
            email="noprofile@example.com",
            password="pass123",
        )
        data = {
            "rated_user_username": user_no_profile.username,
            "rating": 5,
            "comment": "Comment",
        }
        response = authenticated_client.post("/api/v1/ratings/create/", data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestRatingSerializers:
    def test_rating_serializer(self, user_with_profile, technician_user):
        from core_apps.ratings.serializers import RatingSerializer
        rating = Rating.objects.create(
            rated_user=technician_user,
            rating_user=user_with_profile,
            rating=Rating.RatingChoices.FIVE,
            comment="Great!",
        )
        serializer = RatingSerializer(rating)
        data = serializer.data
        assert data["rating"] == 5
        assert data["comment"] == "Great!"

    def test_rating_serializer_create(self, user_with_profile, technician_user):
        from core_apps.ratings.serializers import RatingSerializer
        data = {
            "rated_user_username": technician_user.username,
            "rating": 4,
            "comment": "Good",
        }
        serializer = RatingSerializer(data=data)
        assert serializer.is_valid()

