from rest_framework import serializers

from .models import Apartment


class ApartmentSerializer(serializers.ModelSerializer):
    """Tenant: read assigned apartment. Includes management metadata."""

    class Meta:
        model = Apartment
        exclude = ["pkid", "updated_at"]


class ApartmentCreateForAgentSerializer(serializers.ModelSerializer):
    """Create listing: managed_by is set in the view."""

    class Meta:
        model = Apartment
        fields = ("unit_number", "building", "floor")


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
