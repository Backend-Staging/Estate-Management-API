from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response

from core_apps.common.permissions import IsAgentOrPlatformAdmin
from core_apps.common.renderers import GenericJSONRenderer
from core_apps.profiles.models import Profile
from core_apps.profiles.serializers import ProfileSerializer
from .serializers import RepairStaffCreateSerializer

User = get_user_model()


class RepairStaffCreateAPIView(generics.CreateAPIView):
    """Agent creates a repair-staff login; public registration does not allow role=repair."""

    serializer_class = RepairStaffCreateSerializer
    permission_classes = [IsAgentOrPlatformAdmin]
    renderer_classes = [GenericJSONRenderer]
    object_label = "repair_staff"

    def create(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "message": "Repair staff account created.",
            },
            status=status.HTTP_201_CREATED,
        )


class RepairStaffListAPIView(generics.ListAPIView):
    """Agent lists repair staff they manage, optionally filtered by building."""

    serializer_class = ProfileSerializer
    permission_classes = [IsAgentOrPlatformAdmin]
    renderer_classes = [GenericJSONRenderer]
    object_label = "repair_staff"

    def get_queryset(self):
        user = self.request.user
        qs = Profile.objects.filter(role=Profile.Role.REPAIR).select_related("user")
        if not (user.is_superuser or user.is_staff):
            qs = qs.filter(managed_by_agent=user)
        building = self.request.query_params.get("building")
        if building:
            qs = qs.filter(assigned_building=building)
        return qs.order_by("assigned_building", "user__first_name")
