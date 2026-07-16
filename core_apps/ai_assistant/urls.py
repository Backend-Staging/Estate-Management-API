from django.urls import path

from .views import (
    KnowledgeArticleListAPIView,
    KnowledgeQueryAPIView,
    MaintenanceTriageAPIView,
    OperationsAnalyticsAPIView,
    TenantChatAPIView,
    WorkOrderAssistAPIView,
)

app_name = "ai_assistant"

urlpatterns = [
    path(
        "triage/maintenance/<uuid:issue_id>/",
        MaintenanceTriageAPIView.as_view(),
        name="maintenance-triage",
    ),
    path(
        "knowledge/query/",
        KnowledgeQueryAPIView.as_view(),
        name="knowledge-query",
    ),
    path(
        "knowledge/articles/",
        KnowledgeArticleListAPIView.as_view(),
        name="knowledge-articles",
    ),
    path(
        "work-order/<uuid:issue_id>/",
        WorkOrderAssistAPIView.as_view(),
        name="work-order-assist",
    ),
    path(
        "analytics/operations/",
        OperationsAnalyticsAPIView.as_view(),
        name="operations-analytics",
    ),
    path(
        "chat/tenant/",
        TenantChatAPIView.as_view(),
        name="tenant-chat",
    ),
]
