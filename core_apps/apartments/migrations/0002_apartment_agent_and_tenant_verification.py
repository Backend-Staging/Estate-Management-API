# Phase 1: managing agent and tenant verification

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("apartments", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="apartment",
            name="managed_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="managed_apartments",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Managing agent",
            ),
        ),
        migrations.AddField(
            model_name="apartment",
            name="tenant_verified_at",
            field=models.DateTimeField(
                blank=True,
                null=True,
                verbose_name="Tenant verified at",
            ),
        ),
    ]
