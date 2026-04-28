from django.urls import path
from .views import (
    create_campaign,
    campaign_list,
    my_campaigns,
    campaign_participants,
    update_participation_status,
    campaign_detail,
    ngo_profile,
)
urlpatterns = [
    path('ngo-profile/', ngo_profile),
    path('create-campaign/', create_campaign),
    path('campaigns/', campaign_list),
    path('my-campaigns/', my_campaigns),
    path('campaign-participants/<int:campaign_id>/', campaign_participants),
    path('update-participation/', update_participation_status),
    path('campaign/<int:campaign_id>/', campaign_detail),
]