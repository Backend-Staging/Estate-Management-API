from django.http import Http404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request
from rest_framework.response import Response

from core_apps.common.permissions import IsAgentOrPlatformAdmin
from core_apps.common.renderers import GenericJSONRenderer
from core_apps.profiles.models import Profile

from .models import Apartment
from .serializers import (
    ApartmentCreateForAgentSerializer,
    ApartmentManagedUpdateSerializer,
    ApartmentSerializer,
)


class ApartmentCreateAPIView(generics.CreateAPIView):
    """Agents (or platform admin) create listings for units they manage."""

    queryset = Apartment.objects.all()
    serializer_class = ApartmentCreateForAgentSerializer
    permission_classes = [IsAgentOrPlatformAdmin]
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def perform_create(self, serializer: ApartmentCreateForAgentSerializer) -> None:
        profile = getattr(self.request.user, "profile", None)
        if not (
            self.request.user.is_superuser or self.request.user.is_staff
        ) and not (profile and profile.role == Profile.Role.AGENT):
            raise PermissionDenied("Only property agents can create apartment listings.")
        serializer.save(managed_by=self.request.user)


class ApartmentManagedListAPIView(generics.ListAPIView):
    serializer_class = ApartmentSerializer
    permission_classes = [IsAgentOrPlatformAdmin]
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartments"

    def get_queryset(self):
        u = self.request.user
        if u.is_superuser or u.is_staff:
            return Apartment.objects.all()
        return Apartment.objects.filter(managed_by=u).order_by("unit_number")


class ApartmentManagedUpdateAPIView(generics.RetrieveUpdateAPIView):
    """Agent: update unit, set tenant, set tenant_verified_at."""

    lookup_field = "id"
    lookup_url_kwarg = "id"
    serializer_class = ApartmentManagedUpdateSerializer
    permission_classes = [IsAgentOrPlatformAdmin]
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def get_queryset(self):
        u = self.request.user
        if u.is_superuser or u.is_staff:
            return Apartment.objects.all()
        return Apartment.objects.filter(managed_by=u)

    def get_serializer_class(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return ApartmentSerializer
        return ApartmentManagedUpdateSerializer


class ApartmentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ApartmentSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def get_object(self) -> Apartment:
        apartments = self.request.user.apartment.all()
        obj = apartments.first()
        if obj is None:
            raise Http404("Apartment not found")
        if obj.tenant_verified_at is None:
            raise PermissionDenied("Your tenancy is not verified by your agent yet.")
        return obj
