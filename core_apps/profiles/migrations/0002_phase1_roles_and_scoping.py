# Generated manually for Phase 1 role field

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def assign_roles_from_occupation_and_flags(apps, schema_editor):
    Profile = apps.get_model("profiles", "Profile")
    User = apps.get_model("users", "User")
    for p in Profile.objects.iterator():
        try:
            u = User.objects.get(pk=p.user_id)
        except User.DoesNotExist:
            continue
        if u.is_superuser or u.is_staff:
            p.role = "agent"
        elif p.occupation == "tenant":
            p.role = "tenant"
        else:
            p.role = "repair"
        p.save(update_fields=["role"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="role",
            field=models.CharField(
                choices=[
                    ("agent", "Agent"),
                    ("tenant", "Tenant"),
                    ("repair", "Repair staff"),
                ],
                db_index=True,
                default="tenant",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="profile",
            name="managed_by_agent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="managed_repair_profiles",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Invited by agent",
            ),
        ),
        migrations.RunPython(assign_roles_from_occupation_and_flags, noop_reverse),
    ]
