from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Apartment(TimeStampedModel):
    managed_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="managed_apartments",
        verbose_name=_("Managing agent"),
    )
    unit_number = models.CharField(
        max_length=10, unique=True, verbose_name=_("Unit Number")
    )
    building = models.CharField(max_length=50, verbose_name=_("Building"))
    floor = models.PositiveIntegerField(verbose_name=_("Floor"))
    tenant = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="apartment",
        verbose_name=_("Tenant"),
    )
    tenant_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Tenant verified at"),
    )

    def __str__(self) -> str:
        return f"Unit: {self.unit_number} -  Building: {self.building} - Floor: {self.floor}"
