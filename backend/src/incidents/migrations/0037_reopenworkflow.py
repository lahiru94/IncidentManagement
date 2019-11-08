# Generated by Django 2.2.6 on 2019-11-07 11:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('incidents', '0036_auto_20191107_1704'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReopenWorkflow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('comment', models.TextField()),
                ('actioned_user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='incidents_reopenworkflow_related', related_query_name='incidents_reopenworkflows', to=settings.AUTH_USER_MODEL)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='incidents_reopenworkflow_related', related_query_name='incidents_reopenworkflows', to='incidents.Incident')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
