from django.http import Http404
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError

from core_apps.common.permissions import IsAgentOrPlatformAdmin, user_is_agent, user_is_tenant
from core_apps.common.renderers import GenericJSONRenderer

from .models import Apartment
from .serializers import (
    ApartmentCreateSerializer,
    ApartmentManagedUpdateSerializer,
    ApartmentSerializer,
)


class ApartmentCreateAPIView(generics.CreateAPIView):
    """
    Agents create managed listings (no tenant yet).
    Tenants register their unit and are linked as tenant (pending agent verification).
    """

    queryset = Apartment.objects.all()
    serializer_class = ApartmentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def perform_create(self, serializer: ApartmentCreateSerializer) -> None:
        user = self.request.user

        if user_is_agent(user):
            serializer.save(managed_by=user)
            return

        if not user_is_tenant(user):
            raise PermissionDenied(
                "Only tenants or property agents can register an apartment."
            )

        if user.apartment.exists():
            raise ValidationError(
                {"detail": "You already have an apartment registered."}
            )

        serializer.save(tenant=user, tenant_verified_at=None)


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
    """Agent: update unit info, set tenant, set tenant_verified_at."""

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
        obj = self.request.user.apartment.first()
        if obj is None:
            raise Http404("Apartment not found")
        return obj
