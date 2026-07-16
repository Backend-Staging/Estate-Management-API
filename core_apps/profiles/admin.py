from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "role",
        "managed_by_agent",
        "gender",
        "occupation",
        "slug",
    ]
    list_display_links = ["id", "user"]
    list_filter = ["role", "occupation"]
    autocomplete_fields = ["managed_by_agent"]