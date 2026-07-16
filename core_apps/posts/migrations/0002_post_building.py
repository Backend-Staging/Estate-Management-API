from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="building",
            field=models.CharField(
                blank=True,
                db_index=True,
                default="",
                max_length=50,
                verbose_name="Building",
            ),
        ),
    ]
