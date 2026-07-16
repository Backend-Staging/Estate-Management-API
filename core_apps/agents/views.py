from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response

from core_apps.common.permissions import IsAgentOrPlatformAdmin
from core_apps.common.renderers import GenericJSONRenderer
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
