# Generated by Django 2.2.1 on 2019-10-15 16:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('incidents', '0029_provideadviceworkflow_requestadviceworkflow'),
    ]

    operations = [
        migrations.AlterField(
            model_name='provideadviceworkflow',
            name='initiated_workflow',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='incidents.RequestAdviceWorkflow'),
        ),
    ]
