from django.db import models

# Create your models here.
class React(models.Model):
    card_title =  models.CharField(max_length=256)
    card_desc =  models.CharField(max_length=256)
    card_git_link =  models.CharField(max_length=256)