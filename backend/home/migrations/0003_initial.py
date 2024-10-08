# Generated by Django 4.2.6 on 2024-09-12 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('home', '0002_delete_check'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=100)),
                ('product_link', models.URLField()),
                ('product_platform', models.CharField(max_length=100)),
            ],
        ),
    ]
