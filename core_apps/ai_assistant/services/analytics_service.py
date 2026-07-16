from datetime import timedelta

from django.db.models import Avg, Count, Q
from django.utils import timezone

from core_apps.ai_assistant.models import AITriageRequest
from core_apps.issues.models import Issue
from core_apps.ratings.models import Rating


class OperationsAnalyticsService:

    def get_dashboard_metrics(self, *, user=None) -> dict:
        issues = Issue.objects.all()
        triage = AITriageRequest.objects.all()

        if user and not (user.is_staff or user.is_superuser):
            profile = getattr(user, "profile", None)
            role = getattr(profile, "role", None)
            if role == "repair":
                issues = issues.filter(
                    Q(assigned_to=user) | Q(apartment__managed_by=user)
                )
            elif role == "agent":
                issues = issues.filter(apartment__managed_by=user)

        open_issues = issues.exclude(status=Issue.IssueStatus.RESOLVED)
        resolved = issues.filter(status=Issue.IssueStatus.RESOLVED)

        avg_resolution_days = None
        resolved_with_dates = resolved.filter(resolved_on__isnull=False)
        if resolved_with_dates.exists():
            total_days = 0
            count = 0
            for issue in resolved_with_dates:
                if issue.resolved_on and issue.created_at:
                    delta = issue.resolved_on - issue.created_at.date()
                    total_days += max(delta.days, 0)
                    count += 1
            if count:
                avg_resolution_days = round(total_days / count, 1)

        category_breakdown = list(
            triage.values("category")
            .annotate(count=Count("id"))
            .order_by("-count")[:6]
        )

        priority_breakdown = list(
            open_issues.values("priority")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        emergency_count = triage.filter(emergency=True).count()
        high_priority_open = open_issues.filter(
            priority=Issue.Priority.HIGH
        ).count()

        avg_rating = Rating.objects.aggregate(avg=Avg("rating"))["avg"]
        avg_rating = round(float(avg_rating), 1) if avg_rating else None

        last_30_days = timezone.now() - timedelta(days=30)
        recent_issues = issues.filter(created_at__gte=last_30_days).count()
        recent_triages = triage.filter(created_at__gte=last_30_days).count()

        return {
            "open_issues": open_issues.count(),
            "resolved_issues": resolved.count(),
            "high_priority_open": high_priority_open,
            "emergency_triage_count": emergency_count,
            "avg_resolution_days": avg_resolution_days,
            "avg_satisfaction_rating": avg_rating,
            "issues_last_30_days": recent_issues,
            "triage_last_30_days": recent_triages,
            "category_breakdown": category_breakdown,
            "priority_breakdown": priority_breakdown,
            "triage_total": triage.count(),
        }
