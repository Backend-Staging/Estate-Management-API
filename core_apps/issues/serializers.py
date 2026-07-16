import logging

from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import serializers

from core_apps.common.models import ContentView
from .emails import send_resolution_email
from .models import Issue
from .permissions import user_can_delete_issue, user_can_update_issue

logger = logging.getLogger(__name__)


class IssueSerializer(serializers.ModelSerializer):
    apartment_unit = serializers.ReadOnlyField(source="apartment.unit_number")
    reported_by = serializers.ReadOnlyField(source="reported_by.get_full_name")
    assigned_to = serializers.ReadOnlyField(source="assigned_to.get_full_name")
    managed_by = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    can_update = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = [
            "id",
            "apartment_unit",
            "reported_by",
            "assigned_to",
            "managed_by",
            "title",
            "description",
            "status",
            "priority",
            "view_count",
            "can_update",
            "can_delete",
        ]

    def get_managed_by(self, obj) -> str | None:
        manager = obj.apartment.managed_by
        if manager is None:
            return None
        return manager.get_full_name

    def get_view_count(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return ContentView.objects.filter(
            content_type=content_type, object_id=obj.pkid
        ).count()

    def get_can_update(self, obj) -> bool:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return user_can_update_issue(request.user, obj)

    def get_can_delete(self, obj) -> bool:
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return user_can_delete_issue(request.user, obj)


class IssueStatusUpdateSerializer(serializers.ModelSerializer):
    apartment = serializers.ReadOnlyField(source="apartment.unit_number")
    reported_by = serializers.ReadOnlyField(source="reported_by.get_full_name")
    resolved_by = serializers.ReadOnlyField(source="assigned_to.get_full_name")

    class Meta:
        model = Issue
        fields = [
            "title",
            "description",
            "apartment",
            "reported_by",
            "status",
            "resolved_by",
            "resolved_on",
        ]

    def update(self, instance: Issue, validated_data: dict) -> Issue:
        becoming_resolved = (
            validated_data.get("status") == Issue.IssueStatus.RESOLVED
            and instance.status != Issue.IssueStatus.RESOLVED
        )
        if becoming_resolved:
            validated_data["resolved_on"] = timezone.now().date()

        instance = super().update(instance, validated_data)

        if becoming_resolved:
            send_resolution_email(instance)

        return instance
