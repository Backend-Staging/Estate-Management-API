from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser


def get_user_building(user: AbstractUser) -> str | None:
    apartment = user.apartment.select_related().first()
    if apartment:
        return apartment.building
    profile = getattr(user, "profile", None)
    if profile and profile.assigned_building:
        return profile.assigned_building
    return None
