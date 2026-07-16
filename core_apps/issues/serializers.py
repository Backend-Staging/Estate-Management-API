import logging

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import serializers

from core_apps.common.models import ContentView
from core_apps.profiles.models import Profile
from .emails import send_resolution_email
from .models import Issue
from .permissions import user_can_delete_issue, user_can_update_issue

User = get_user_model()
logger = logging.getLogger(__name__)


class IssueSerializer(serializers.ModelSerializer):
    apartment_unit = serializers.ReadOnlyField(source="apartment.unit_number")
    apartment_building = serializers.ReadOnlyField(source="apartment.building")
    reported_by = serializers.ReadOnlyField(source="reported_by.get_full_name")
    assigned_to_name = serializers.ReadOnlyField(source="assigned_to.get_full_name")
    assigned_to_id = serializers.UUIDField(source="assigned_to.id", read_only=True)
    managed_by = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    can_update = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(profile__role=Profile.Role.REPAIR),
        required=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = Issue
        fields = [
            "id",
            "apartment_unit",
            "apartment_building",
            "reported_by",
            "assigned_to",
            "assigned_to_name",
            "assigned_to_id",
            "managed_by",
            "title",
            "description",
            "status",
            "priority",
            "view_count",
            "can_update",
            "can_delete",
        ]

    def validate_assigned_to(self, value):
        if value is None:
            return value
        apartment = self.context.get("apartment")
        if apartment is None:
            return value
        profile = getattr(value, "profile", None)
        if not profile or profile.role != Profile.Role.REPAIR:
            raise serializers.ValidationError("Assigned user must be repair staff.")
        if profile.assigned_building and profile.assigned_building != apartment.building:
            raise serializers.ValidationError(
                "This maintenance person does not serve your building."
            )
        return value

    def get_managed_by(self, obj) -> str | None:
        manager = obj.apartment.managed_by
        if manager is None:
            return None
        return manager.get_full_name()

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
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(profile__role=Profile.Role.REPAIR),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Issue
        fields = [
            "title",
            "description",
            "apartment",
            "reported_by",
            "status",
            "assigned_to",
            "resolved_by",
            "resolved_on",
        ]

    def validate_assigned_to(self, value):
        if value is None:
            return value
        profile = getattr(value, "profile", None)
        if not profile or profile.role != Profile.Role.REPAIR:
            raise serializers.ValidationError("Assigned user must be repair staff.")
        building = self.instance.apartment.building
        if profile.assigned_building and profile.assigned_building != building:
            raise serializers.ValidationError(
                "This maintenance person does not serve this building."
            )
        return value

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
