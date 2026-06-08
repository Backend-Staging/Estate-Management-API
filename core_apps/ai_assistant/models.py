from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

from core_apps.common.models import TimeStampedModel

User = get_user_model()

class AITriageRequest(TimeStampedModel):
    issue = models.ForeignKey("issues.Issue", on_delete=models.CASCADE, related_name="ai_triage_requests")
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100)
    urgency = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    emergency = models.BooleanField(default=False)
    tenant_sumary = models.TextField()
    staff_recommendation = models.TextField()
    raw_response = models.JSONField(default=dict)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "AI Triage Request"
        verbose_name_plural = "AI Triage Requests"
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"Triage Request for Issue #{self.issue.pkid} - {self.category} - {self.sub_category} - {self.urgency}"