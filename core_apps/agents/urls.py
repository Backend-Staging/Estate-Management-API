from django.urls import path

from .views import RepairStaffCreateAPIView

urlpatterns = [
    path(
        "repair-staff/",
        RepairStaffCreateAPIView.as_view(),
        name="agent-repair-staff-create",
    ),
]
