from django.urls import path

from .views import (
    ApartmentCreateAPIView,
    ApartmentDetailAPIView,
    ApartmentManagedListAPIView,
    ApartmentManagedUpdateAPIView,
)

urlpatterns = [
    path("add/", ApartmentCreateAPIView.as_view(), name="add-apartment"),
    path("managed/", ApartmentManagedListAPIView.as_view(), name="apartments-managed"),
    path(
        "managed/<uuid:id>/",
        ApartmentManagedUpdateAPIView.as_view(),
        name="apartment-managed-detail",
    ),
    path("my-apartment/", ApartmentDetailAPIView.as_view(), name="apartment-detail"),
]
