from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0003_alter_profile_city_of_origin_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="assigned_building",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Building this repair staff member serves.",
                max_length=50,
                verbose_name="Assigned building",
            ),
        ),
    ]
