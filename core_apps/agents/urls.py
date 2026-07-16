from django.urls import path

from .views import RepairStaffCreateAPIView, RepairStaffListAPIView

urlpatterns = [
    path(
        "repair-staff/",
        RepairStaffCreateAPIView.as_view(),
        name="agent-repair-staff-create",
    ),
    path(
        "repair-staff/list/",
        RepairStaffListAPIView.as_view(),
        name="agent-repair-staff-list",
    ),
]
