import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from unittest.mock import patch, MagicMock

from core_apps.issues.models import Issue
from core_apps.apartments.models import Apartment
from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
class TestIssueModel:
    def test_issue_creation(self, db, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="201",
            building="A",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Leaky faucet",
            description="The faucet in the kitchen is leaking",
            status=Issue.IssueStatus.REPORTED,
            priority=Issue.Priority.MEDIUM,
        )
        assert issue.title == "Leaky faucet"
        assert issue.status == Issue.IssueStatus.REPORTED
        assert issue.priority == Issue.Priority.MEDIUM

    def test_issue_str(self, db, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="202",
            building="B",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Broken window",
            description="Window is broken",
        )
        assert str(issue) == "Broken window"

    @patch("core_apps.issues.models.EmailMultiAlternatives")
    def test_issue_notify_assigned_user(self, mock_email, db, user_with_profile, staff_user):
        apartment = Apartment.objects.create(
            unit_number="203",
            building="C",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Test issue",
            description="Test description",
        )
        issue.assigned_to = staff_user
        issue.save()
        mock_email.return_value.send.assert_called_once()


@pytest.mark.django_db
class TestIssueViews:
    def test_issue_list_view_staff(self, staff_client, db, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="204",
            building="D",
            floor=2,
            tenant=user_with_profile,
        )
        Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Issue 1",
            description="Description 1",
        )
        response = staff_client.get("/api/v1/issues/")
        assert response.status_code == status.HTTP_200_OK
        assert "issues" in response.data

    def test_issue_list_view_non_staff(self, authenticated_client):
        response = authenticated_client.get("/api/v1/issues/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_my_issues_list_view(self, authenticated_client, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="205",
            building="E",
            floor=2,
            tenant=user_with_profile,
        )
        Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="My Issue",
            description="My description",
        )
        response = authenticated_client.get("/api/v1/issues/me/")
        assert response.status_code == status.HTTP_200_OK
        assert "my_issues" in response.data

    def test_assigned_issues_list_view(self, authenticated_client, user_with_profile, staff_user):
        apartment = Apartment.objects.create(
            unit_number="206",
            building="F",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Assigned Issue",
            description="Description",
            assigned_to=staff_user,
        )
        api_client = authenticated_client
        api_client.force_authenticate(user=staff_user)
        response = api_client.get("/api/v1/issues/assigned/")
        assert response.status_code == status.HTTP_200_OK
        assert "assigned_issues" in response.data

    @patch("core_apps.issues.emails.send_issue_confirmation_email")
    def test_issue_create_view(self, mock_email, authenticated_client, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="207",
            building="G",
            floor=2,
            tenant=user_with_profile,
        )
        data = {
            "title": "New Issue",
            "description": "New description",
            "priority": "high",
        }
        response = authenticated_client.post(
            f"/api/v1/issues/create/{apartment.id}/", data
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Issue.objects.filter(title="New Issue").exists()
        mock_email.assert_called_once()

    def test_issue_create_view_not_owner(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        apartment = Apartment.objects.create(
            unit_number="208",
            building="H",
            floor=2,
            tenant=other_user,
        )
        data = {
            "title": "New Issue",
            "description": "New description",
        }
        response = authenticated_client.post(
            f"/api/v1/issues/create/{apartment.id}/", data
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_issue_detail_view(self, authenticated_client, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="209",
            building="I",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Detail Issue",
            description="Description",
        )
        response = authenticated_client.get(f"/api/v1/issues/{issue.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "Detail Issue"

    def test_issue_detail_view_unauthorized(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="other2",
            email="other2@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        apartment = Apartment.objects.create(
            unit_number="210",
            building="J",
            floor=2,
            tenant=other_user,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=other_user,
            title="Private Issue",
            description="Description",
        )
        response = authenticated_client.get(f"/api/v1/issues/{issue.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    @patch("core_apps.issues.emails.send_resolution_email")
    def test_issue_update_view(self, mock_email, staff_client, user_with_profile, staff_user):
        apartment = Apartment.objects.create(
            unit_number="211",
            building="K",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Update Issue",
            description="Description",
            assigned_to=staff_user,
        )
        data = {
            "status": "resolved",
        }
        response = staff_client.patch(f"/api/v1/issues/update/{issue.id}/", data)
        assert response.status_code == status.HTTP_200_OK
        issue.refresh_from_db()
        assert issue.status == Issue.IssueStatus.RESOLVED
        mock_email.assert_called_once()

    def test_issue_delete_view(self, authenticated_client, user_with_profile):
        apartment = Apartment.objects.create(
            unit_number="212",
            building="L",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Delete Issue",
            description="Description",
        )
        response = authenticated_client.delete(f"/api/v1/issues/delete/{issue.id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Issue.objects.filter(id=issue.id).exists()

    def test_issue_delete_view_unauthorized(self, authenticated_client, user_with_profile):
        other_user = User.objects.create_user(
            username="other3",
            email="other3@example.com",
            password="pass123",
        )
        Profile.objects.create(
            user=other_user,
            occupation=Profile.Occupation.TENANT,
        )
        apartment = Apartment.objects.create(
            unit_number="213",
            building="M",
            floor=2,
            tenant=other_user,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=other_user,
            title="Delete Issue",
            description="Description",
        )
        response = authenticated_client.delete(f"/api/v1/issues/delete/{issue.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestIssueSerializers:
    def test_issue_serializer(self, db, user_with_profile):
        from core_apps.issues.serializers import IssueSerializer
        apartment = Apartment.objects.create(
            unit_number="214",
            building="N",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Serializer Issue",
            description="Description",
        )
        serializer = IssueSerializer(issue)
        data = serializer.data
        assert data["title"] == "Serializer Issue"
        assert "apartment_unit" in data
        assert "reported_by" in data

    def test_issue_status_update_serializer(self, db, user_with_profile, staff_user):
        from core_apps.issues.serializers import IssueStatusUpdateSerializer
        apartment = Apartment.objects.create(
            unit_number="215",
            building="O",
            floor=2,
            tenant=user_with_profile,
        )
        issue = Issue.objects.create(
            apartment=apartment,
            reported_by=user_with_profile,
            title="Status Issue",
            description="Description",
            assigned_to=staff_user,
        )
        data = {"status": "resolved"}
        serializer = IssueStatusUpdateSerializer(issue, data=data, partial=True)
        assert serializer.is_valid()
        serializer.save()
        issue.refresh_from_db()
        assert issue.status == Issue.IssueStatus.RESOLVED
        assert issue.resolved_on is not None

