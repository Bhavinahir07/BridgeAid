from django.db import models
from accounts.models import User

class NGO(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization_name = models.CharField(max_length=200, blank=True)
    address = models.TextField(blank=True)
    registration_number = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.email
    
class Campaign(models.Model):
    URGENCY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)

    # 🔥 NEW FIELD (for matching)
    required_skills = models.CharField(max_length=255, blank=True)

    date = models.DateField()
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    status = models.CharField(max_length=20, default='active')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title