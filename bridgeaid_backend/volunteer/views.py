from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ngo.models import Campaign
from .models import Volunteer
from matching.models import CampaignParticipation


# 🔥 HELPER FUNCTION
def _split_skills(value):
    if not value:
        return set()
    return {
        skill.strip().lower()
        for skill in value.split(',')
        if skill.strip()
    }


def calculate_match_score(volunteer, campaign):
    score = 0
    reasons = []

    volunteer_skills = _split_skills(volunteer.skills)
    campaign_skills = _split_skills(campaign.required_skills)
    matched_skills = sorted(volunteer_skills.intersection(campaign_skills))

    if matched_skills:
        score += 3 * len(matched_skills)
        reasons.append(f"skills: {', '.join(matched_skills)}")

    volunteer_location = (volunteer.location or "").lower()
    campaign_location = (campaign.location or "").lower()
    if volunteer_location and campaign_location and campaign_location in volunteer_location:
        score += 2
        reasons.append("location match")

    volunteer_availability = (volunteer.availability or "").lower()
    if "weekend" in volunteer_availability:
        score += 1
        reasons.append("availability match")

    if getattr(campaign, "urgency", "") == "high":
        score += 2
        reasons.append("urgent")

    return score, reasons


# 🔥 JOIN CAMPAIGN
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_campaign(request):
    user = request.user

    if user.role != 'volunteer':
        return Response({"error": "Only volunteer can join"}, status=403)

    campaign_id = request.data.get('campaign_id')

    if not campaign_id:
        return Response({"error": "campaign_id required"}, status=400)

    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)

    try:
        volunteer = Volunteer.objects.get(user=user)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer profile not found"}, status=404)

    if CampaignParticipation.objects.filter(volunteer=volunteer, campaign=campaign).exists():
        return Response({"error": "Already joined"}, status=400)

    CampaignParticipation.objects.create(
        volunteer=volunteer,
        campaign=campaign,
        status='pending'
    )

    return Response({
        "message": "Joined successfully",
        "campaign": campaign.title,
        "user": user.email
    })


# 🔥 MY CAMPAIGNS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_campaigns(request):
    user = request.user

    if user.role != 'volunteer':
        return Response({"error": "Only volunteers allowed"}, status=403)

    try:
        volunteer = Volunteer.objects.get(user=user)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer profile not found"}, status=404)

    participations = CampaignParticipation.objects.filter(volunteer=volunteer)

    data = []

    for p in participations:
        c = p.campaign
        data.append({
            "campaign_id": c.id,
            "title": c.title,
            "description": c.description,
            "location": c.location,
            "required_skills": c.required_skills,
            "date": str(c.date),
            "status": p.status
        })

    return Response(data)


# 🔥 RECOMMENDED CAMPAIGNS (IMPROVED)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_campaigns(request):
    user = request.user

    if user.role != 'volunteer':
        return Response({"error": "Only volunteers allowed"}, status=403)

    try:
        volunteer = Volunteer.objects.get(user=user)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer profile not found"}, status=404)

    campaigns = Campaign.objects.filter(status='active')
    joined_campaign_ids = set(
        CampaignParticipation.objects.filter(volunteer=volunteer).values_list('campaign_id', flat=True)
    )

    result = []

    for c in campaigns:
        if c.id in joined_campaign_ids:
            continue

        score, reasons = calculate_match_score(volunteer, c)

        # 🔥 ONLY ADD IF RELEVANT
        if score > 0:
            result.append({
                "campaign_id": c.id,
                "title": c.title,
                "description": c.description,
                "location": c.location,
                "required_skills": c.required_skills,
                "date": str(c.date),
                "match_score": score,
                "match_reasons": reasons,
            })

    # 🔥 SORT BY BEST MATCH
    result.sort(key=lambda x: x['match_score'], reverse=True)

    return Response(result)