from core_apps.common.permissions import user_is_platform_admin

from .models import Issue


def user_can_view_issue(user, issue: Issue) -> bool:
    if user_is_platform_admin(user):
        return True
    if issue.reported_by_id == user.id or issue.assigned_to_id == user.id:
        return True
    ap = issue.apartment
    if ap.managed_by_id == user.id:
        return True
    return False


def user_can_update_issue(user, issue: Issue) -> bool:
    if user_is_platform_admin(user):
        return True
    if issue.assigned_to_id == user.id:
        return True
    ap = issue.apartment
    if ap.managed_by_id == user.id:
        return True
    return False


def user_can_delete_issue(user, issue: Issue) -> bool:
    if user_is_platform_admin(user):
        return True
    if issue.reported_by_id == user.id:
        return True
    ap = issue.apartment
    if ap.managed_by_id == user.id:
        return True
    return False
