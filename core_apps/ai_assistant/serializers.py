from rest_framework import serializers

from .models import (
    AIChatMessage,
    AITriageRequest,
    AIWorkOrderInsight,
    PropertyKnowledgeArticle,
)


class AITriageRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITriageRequest
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "updated_at",
            "raw_response",
            "created_by",
            "category",
            "sub_category",
            "urgency",
            "department",
            "emergency",
            "tenant_summary",
            "staff_recommendation",
        ]


class PropertyKnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyKnowledgeArticle
        fields = ["id", "slug", "title", "category", "content", "building"]


class KnowledgeQuerySerializer(serializers.Serializer):
    question = serializers.CharField(max_length=500)


class KnowledgeAnswerSerializer(serializers.Serializer):
    question = serializers.CharField()
    answer = serializers.CharField()
    sources = serializers.ListField(child=serializers.DictField())


class WorkOrderInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIWorkOrderInsight
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "updated_at",
            "raw_response",
            "created_by",
            "work_order_summary",
            "suggested_tenant_response",
            "escalation_recommendation",
            "duplicate_issue_ids",
        ]


class TenantChatSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)


class TenantChatResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    reply = serializers.CharField()
    sources = serializers.ListField(child=serializers.DictField(), required=False)


class OperationsAnalyticsSerializer(serializers.Serializer):
    open_issues = serializers.IntegerField()
    resolved_issues = serializers.IntegerField()
    high_priority_open = serializers.IntegerField()
    emergency_triage_count = serializers.IntegerField()
    avg_resolution_days = serializers.FloatField(allow_null=True)
    avg_satisfaction_rating = serializers.FloatField(allow_null=True)
    issues_last_30_days = serializers.IntegerField()
    triage_last_30_days = serializers.IntegerField()
    category_breakdown = serializers.ListField(child=serializers.DictField())
    priority_breakdown = serializers.ListField(child=serializers.DictField())
    triage_total = serializers.IntegerField()
