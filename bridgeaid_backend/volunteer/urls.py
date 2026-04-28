from django.urls import path
from .views import join_campaign, my_campaigns,recommended_campaigns

urlpatterns = [
    path('join-campaign/', join_campaign),
    path('my-campaigns/', my_campaigns),
    path('recommended-campaigns/', recommended_campaigns),
]