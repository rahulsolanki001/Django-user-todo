from django.db import models

# Create your models here.

from django.db import models

from django.contrib.auth.models import AbstractUser

import datetime

# Create your models here.

class User(AbstractUser):
    email=models.CharField(max_length=30,unique=True)
    password=models.CharField(max_length=30)


    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

class Todo(models.Model):
    task=models.CharField(max_length=300,blank=False)
    completed=models.BooleanField(default=False)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    created_at=models.DateField(default=datetime.date.today)

    class Meta:
        ordering=['created_at']

    def __str__(self):
        return self.user.username
