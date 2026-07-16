from django.urls import path

from .views import MaintenanceTriageAPIView

app_name = "ai_assistant"

urlpatterns = [
    path(
        "triage/maintenance/<uuid:issue_id>/",
        MaintenanceTriageAPIView.as_view(),
        name="maintenance-triage",
    ),
]



