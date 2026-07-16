import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

from core_apps.apartments.models import Apartment
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestApartmentModel:
    def test_apartment_creation(self, db, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="101",
            building="A",
            floor=1,
            tenant=user_with_profile,
        )
        assert apartment.unit_number == "101"
        assert apartment.building == "A"
        assert apartment.floor == 1
        assert apartment.tenant == user_with_profile

    def test_apartment_str(self, db, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="101",
            building="A",
            floor=1,
            tenant=user_with_profile,
        )
        assert "Unit: 101" in str(apartment)
        assert "Building: A" in str(apartment)

    def test_apartment_unit_number_unique(self, db, user_with_profile):
        Apartment.objects.create(
            unit_number="101",
            building="A",
            floor=1,
        )
        with pytest.raises(Exception):
            Apartment.objects.create(
                unit_number="101",
                building="B",
                floor=2,
            )

    def test_apartment_tenant_nullable(self, db):
        apartment = Apartment.objects.create(
            unit_number="101",
            building="A",
            floor=1,
        )
        assert apartment.tenant is None


@pytest.mark.django_db
class TestApartmentViews:
    def test_apartment_create_view_tenant(self, authenticated_client, user_with_profile):
        data = {
            "unit_number": "102",
            "building": "B",
            "floor": 2,
        }
        response = authenticated_client.post("/api/v1/apartments/add/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Apartment.objects.filter(unit_number="102").exists()

    def test_apartment_create_view_non_tenant(self, authenticated_client, technician_user):
        api_client = authenticated_client
        api_client.force_authenticate(user=technician_user)
        data = {
            "unit_number": "103",
            "building": "C",
            "floor": 3,
        }
        response = api_client.post("/api/v1/apartments/add/", data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_apartment_create_view_superuser(self, superuser_client):
        data = {
            "unit_number": "104",
            "building": "D",
            "floor": 4,
        }
        response = superuser_client.post("/api/v1/apartments/add/", data)
        assert response.status_code == status.HTTP_201_CREATED

    def test_apartment_detail_view(self, authenticated_client, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="105",
            building="E",
            floor=5,
            tenant=user_with_profile,
        )
        response = authenticated_client.get("/api/v1/apartments/my-apartment/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["unit_number"] == "105"

    def test_apartment_detail_view_not_owner(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        Apartment.objects.create(
            unit_number="106",
            building="F",
            floor=6,
            tenant=other_user,
        )
        response = authenticated_client.get("/api/v1/apartments/my-apartment/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_apartment_detail_view_unauthenticated(self, api_client, user_with_profile):
        Apartment.objects.create(
            unit_number="107",
            building="G",
            floor=7,
            tenant=user_with_profile,
        )
        response = api_client.get("/api/v1/apartments/my-apartment/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestApartmentSerializers:
    def test_apartment_serializer(self, db, user_with_profile):
        from core_apps.apartments.serializers import ApartmentSerializer
        apartment = Apartment.objects.create(
            unit_number="108",
            building="H",
            floor=8,
            tenant=user_with_profile,
        )
        serializer = ApartmentSerializer(apartment)
        data = serializer.data
        assert data["unit_number"] == "108"
        assert data["building"] == "H"
        assert data["floor"] == 8

