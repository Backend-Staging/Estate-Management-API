"""Filter posts and tags by building for authenticated residents."""

from __future__ import annotations

from django.db.models import QuerySet

from core_apps.common.building import get_user_building


def resolve_building_filter(request) -> str | None:
    """Return building to filter by, or None for unscoped lists."""
    explicit = request.query_params.get("building")
    if explicit:
        return explicit

    user = request.user
    if not user.is_authenticated:
        return None

    profile = getattr(user, "profile", None)
    if profile and profile.role == "agent":
        return None

    if user.is_staff or user.is_superuser:
        return None

    return get_user_building(user)


def filter_posts_by_building(queryset: QuerySet, request) -> QuerySet:
    building = resolve_building_filter(request)
    if building:
        return queryset.filter(building=building)
    return queryset
