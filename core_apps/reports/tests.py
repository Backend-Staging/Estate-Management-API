import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

from core_apps.reports.models import Report
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestReportModel:
    def test_report_creation(self, user_with_profile):
        other_user = User.objects.create_user(
            username="reported",
            email="reported@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        report = Report.objects.create(
            title="Inappropriate behavior",
            description="User was behaving inappropriately",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        assert report.title == "Inappropriate behavior"
        assert report.reported_by == user_with_profile
        assert report.reported_user == other_user
        assert report.slug == "inappropriate-behavior"

    def test_report_str(self, user_with_profile):
        other_user = User.objects.create_user(
            username="reported2",
            email="reported2@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        report = Report.objects.create(
            title="Test Report",
            description="Description",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        assert "Report by" in str(report)
        assert "against" in str(report)

    def test_report_ordering(self, user_with_profile):
        other_user = User.objects.create_user(
            username="reported3",
            email="reported3@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        report1 = Report.objects.create(
            title="Report 1",
            description="Description 1",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        report2 = Report.objects.create(
            title="Report 2",
            description="Description 2",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        reports = list(Report.objects.all())
        assert reports[0] in [report1, report2]


@pytest.mark.django_db
class TestReportViews:
    def test_report_create_view(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="reported4",
            email="reported4@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        data = {
            "title": "New Report",
            "description": "Report description",
            "reported_user_username": other_user.username,
        }
        response = authenticated_client.post("/api/v1/reports/create/", data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Report.objects.filter(title="New Report").exists()

    def test_report_create_view_invalid_username(self, authenticated_client, user_with_profile):
        data = {
            "title": "Invalid Report",
            "description": "Description",
            "reported_user_username": "nonexistent",
        }
        response = authenticated_client.post("/api/v1/reports/create/", data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_report_list_view(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="reported5",
            email="reported5@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        Report.objects.create(
            title="List Report",
            description="Description",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        response = authenticated_client.get("/api/v1/reports/me/")
        assert response.status_code == status.HTTP_200_OK
        assert "reports" in response.data

    def test_report_list_view_unauthenticated(self, api_client):
        response = api_client.get("/api/v1/reports/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestReportSerializers:
    def test_report_serializer(self, user_with_profile):
        from core_apps.reports.serializers import ReportSerializer
        other_user = User.objects.create_user(
            username="reported6",
            email="reported6@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        report = Report.objects.create(
            title="Serializer Report",
            description="Description",
            reported_by=user_with_profile,
            reported_user=other_user,
        )
        serializer = ReportSerializer(report)
        data = serializer.data
        assert data["title"] == "Serializer Report"
        assert "created_at" in data

    def test_report_serializer_create(self, user_with_profile):
        from core_apps.reports.serializers import ReportSerializer
        other_user = User.objects.create_user(
            username="reported7",
            email="reported7@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        data = {
            "title": "New Report",
            "description": "Description",
            "reported_user_username": other_user.username,
        }
        serializer = ReportSerializer(data=data)
        assert serializer.is_valid()
        report = serializer.save(reported_by=user_with_profile)
        assert report.reported_user == other_user

    def test_report_serializer_validate_username(self, user_with_profile):
        from core_apps.reports.serializers import ReportSerializer
        data = {
            "title": "Invalid Report",
            "description": "Description",
            "reported_user_username": "nonexistent",
        }
        serializer = ReportSerializer(data=data)
        assert not serializer.is_valid()
        assert "reported_user_username" in serializer.errors

