from django.db import models
from accounts.models import User

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # already good 👍
    skills = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    availability = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.email