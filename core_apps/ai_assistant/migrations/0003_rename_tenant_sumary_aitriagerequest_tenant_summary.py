from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("ai_assistant", "0002_alter_aitriagerequest_issue"),
    ]

    operations = [
        migrations.RenameField(
            model_name="aitriagerequest",
            old_name="tenant_sumary",
            new_name="tenant_summary",
        ),
    ]
