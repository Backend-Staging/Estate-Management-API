from django.contrib import admin

from .models import (
    AIChatMessage,
    AITriageRequest,
    AIWorkOrderInsight,
    PropertyKnowledgeArticle,
)


@admin.register(AITriageRequest)
class AITriageRequestAdmin(admin.ModelAdmin):
    list_display = ("issue", "category", "urgency", "emergency", "created_at")
    list_filter = ("category", "urgency", "emergency")


@admin.register(PropertyKnowledgeArticle)
class PropertyKnowledgeArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "building", "is_active")
    list_filter = ("category", "is_active")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(AIWorkOrderInsight)
class AIWorkOrderInsightAdmin(admin.ModelAdmin):
    list_display = ("issue", "created_at", "created_by")


@admin.register(AIChatMessage)
class AIChatMessageAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "created_at")
    list_filter = ("role",)
