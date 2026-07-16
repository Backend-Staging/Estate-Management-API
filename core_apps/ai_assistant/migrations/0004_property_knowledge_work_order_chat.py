# Generated manually for AI assistant expansion

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("issues", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("ai_assistant", "0003_rename_tenant_sumary_aitriagerequest_tenant_summary"),
    ]

    operations = [
        migrations.AlterField(
            model_name="aitriagerequest",
            name="sub_category",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.CreateModel(
            name="PropertyKnowledgeArticle",
            fields=[
                ("pkid", models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("slug", models.SlugField(max_length=120, unique=True)),
                ("title", models.CharField(max_length=255)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("lease", "Lease Rules"),
                            ("policy", "Property Policy"),
                            ("hoa", "HOA Guidelines"),
                            ("emergency", "Emergency Procedures"),
                            ("maintenance", "Maintenance FAQ"),
                        ],
                        max_length=50,
                    ),
                ),
                ("content", models.TextField()),
                ("building", models.CharField(blank=True, default="", max_length=120)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "ordering": ["category", "title"],
            },
        ),
        migrations.CreateModel(
            name="AIWorkOrderInsight",
            fields=[
                ("pkid", models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("work_order_summary", models.TextField()),
                ("suggested_tenant_response", models.TextField()),
                ("escalation_recommendation", models.TextField()),
                ("duplicate_issue_ids", models.JSONField(default=list)),
                ("raw_response", models.JSONField(default=dict)),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "issue",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_work_order_insights",
                        to="issues.issue",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="AIChatMessage",
            fields=[
                ("pkid", models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "role",
                    models.CharField(
                        choices=[("user", "User"), ("assistant", "Assistant")],
                        max_length=20,
                    ),
                ),
                ("content", models.TextField()),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_chat_messages",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),
    ]
