from django.db import migrations, models


def convert_waiting_to_pending(apps, schema_editor):
    CampaignParticipation = apps.get_model('matching', 'CampaignParticipation')
    CampaignParticipation.objects.filter(status='waiting').update(status='pending')


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0003_update_campaignparticipation_status'),
    ]

    operations = [
        migrations.RunPython(convert_waiting_to_pending, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='campaignparticipation',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('completed', 'Completed')], default='pending', max_length=20),
        ),
    ]
