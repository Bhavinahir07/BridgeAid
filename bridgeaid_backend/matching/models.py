from django.db import models
from volunteer.models import Volunteer
from ngo.models import Campaign

class CampaignParticipation(models.Model):

    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('volunteer', 'campaign')

    def __str__(self):
        return f"{self.volunteer.user.email} → {self.campaign.title} ({self.status})"