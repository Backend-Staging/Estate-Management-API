from rest_framework import serializers

from .models import Apartment


class ApartmentSerializer(serializers.ModelSerializer):
    """Tenant: read assigned apartment. Includes management metadata."""

    class Meta:
        model = Apartment
        exclude = ["pkid", "updated_at"]


class ApartmentCreateSerializer(serializers.ModelSerializer):
    """Create a unit (agent listing or tenant self-registration)."""

    class Meta:
        model = Apartment
        fields = ("unit_number", "building", "floor")


class ApartmentCreateForAgentSerializer(ApartmentCreateSerializer):
    """Backward-compatible alias for agent create serializer."""

    pass


class ApartmentManagedUpdateSerializer(serializers.ModelSerializer):
    """Agent updates unit info, tenant assignment, or marks tenant verified."""

    class Meta:
        model = Apartment
        fields = (
            "unit_number",
            "building",
            "floor",
            "tenant",
            "tenant_verified_at",
        )
