from __future__ import annotations

from typing import TYPE_CHECKING

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView

from core_apps.profiles.models import Profile

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser


def user_is_platform_admin(user: AbstractUser) -> bool:
    return bool(
        user and user.is_authenticated and (user.is_superuser or user.is_staff)
    )


def user_is_agent(user: AbstractUser) -> bool:
    if not user.is_authenticated:
        return False
    if user_is_platform_admin(user):
        return True
    profile = getattr(user, "profile", None)
    return bool(profile and profile.role == Profile.Role.AGENT)


def user_is_tenant(user: AbstractUser) -> bool:
    if not user.is_authenticated:
        return False
    if user_is_platform_admin(user):
        return True
    profile = getattr(user, "profile", None)
    return bool(profile and profile.role == Profile.Role.TENANT)


def user_is_repair(user: AbstractUser) -> bool:
    if not user.is_authenticated:
        return False
    if user_is_platform_admin(user):
        return True
    profile = getattr(user, "profile", None)
    return bool(profile and profile.role == Profile.Role.REPAIR)


class IsAgentOrPlatformAdmin(permissions.BasePermission):
    """Property agents and Django staff/superuser (full product access)."""

    message = "This action is restricted to property agents."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return user_is_agent(request.user)


class IsTenantOrPlatformAdmin(permissions.BasePermission):
    message = "This action is restricted to tenants."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return user_is_tenant(request.user)


class IsRepairOrPlatformAdmin(permissions.BasePermission):
    message = "This action is restricted to repair staff."

    def has_permission(self, request: Request, view: APIView) -> bool:
        return user_is_repair(request.user)


class IsTenantNotRepair(permissions.BasePermission):
    """Tenant-facing community features; excludes repair-only accounts."""

    message = "This action is not available for repair staff accounts."

    def has_permission(self, request: Request, view: APIView) -> bool:
        u = request.user
        if not u.is_authenticated:
            return False
        if user_is_platform_admin(u):
            return True
        profile = getattr(u, "profile", None)
        if not profile:
            return False
        return profile.role == Profile.Role.TENANT
