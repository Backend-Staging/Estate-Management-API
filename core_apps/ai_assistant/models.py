from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

from core_apps.common.models import TimeStampedModel

User = get_user_model()


class AITriageRequest(TimeStampedModel):
    issue = models.ForeignKey(
        "issues.Issue",
        on_delete=models.CASCADE,
        related_name="ai_triage_requests",
    )
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100, blank=True, default="")
    urgency = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    emergency = models.BooleanField(default=False)
    tenant_summary = models.TextField()
    staff_recommendation = models.TextField()
    raw_response = models.JSONField(default=dict)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = "AI Triage Request"
        verbose_name_plural = "AI Triage Requests"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"Triage Request for Issue #{self.issue.pkid} - "
            f"{self.category} - {self.urgency}"
        )


class PropertyKnowledgeArticle(TimeStampedModel):
    class Category(models.TextChoices):
        LEASE = "lease", "Lease Rules"
        POLICY = "policy", "Property Policy"
        HOA = "hoa", "HOA Guidelines"
        EMERGENCY = "emergency", "Emergency Procedures"
        MAINTENANCE = "maintenance", "Maintenance FAQ"

    slug = models.SlugField(max_length=120, unique=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=Category.choices)
    content = models.TextField()
    building = models.CharField(max_length=120, blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "title"]

    def __str__(self):
        return self.title


class AIWorkOrderInsight(TimeStampedModel):
    issue = models.ForeignKey(
        "issues.Issue",
        on_delete=models.CASCADE,
        related_name="ai_work_order_insights",
    )
    work_order_summary = models.TextField()
    suggested_tenant_response = models.TextField()
    escalation_recommendation = models.TextField()
    duplicate_issue_ids = models.JSONField(default=list)
    raw_response = models.JSONField(default=dict)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Work order insight for issue #{self.issue.pkid}"


class AIChatMessage(TimeStampedModel):
    class Role(models.TextChoices):
        USER = "user", "User"
        ASSISTANT = "assistant", "Assistant"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ai_chat_messages",
    )
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.role} message for {self.user_id}"