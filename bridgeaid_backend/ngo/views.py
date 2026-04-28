from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Campaign, NGO
from matching.models import CampaignParticipation
from volunteer.models import Volunteer


def _is_ngo_profile_complete(ngo_profile):
    return bool(
        (ngo_profile.organization_name or '').strip()
        and (ngo_profile.address or '').strip()
        and (ngo_profile.registration_number or '').strip()
    )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def ngo_profile(request):
    user = request.user
    if user.role != 'ngo':
        return Response({"error": "Only NGO allowed"}, status=403)

    ngo, _ = NGO.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            "name": user.name,
            "email": user.email,
            "organization_name": ngo.organization_name,
            "address": ngo.address,
            "registration_number": ngo.registration_number,
            "is_complete": _is_ngo_profile_complete(ngo),
        })

    ngo.organization_name = request.data.get('organization_name', ngo.organization_name)
    ngo.address = request.data.get('address', ngo.address)
    ngo.registration_number = request.data.get('registration_number', ngo.registration_number)
    ngo.save()

    return Response({
        "message": "NGO profile updated",
        "is_complete": _is_ngo_profile_complete(ngo),
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_campaign(request):
    user = request.user

    # 🔥 ROLE CHECK
    if user.role != 'ngo':
        return Response({"error": "Only NGO can create campaign"}, status=403)

    ngo_profile, _ = NGO.objects.get_or_create(user=user)
    if not _is_ngo_profile_complete(ngo_profile):
        return Response({"error": "Complete NGO profile before creating campaign"}, status=400)

    data = request.data
    title = data.get('title')
    description = data.get('description')
    location = data.get('location')
    date = data.get('date')
    required_skills = data.get('required_skills')
    urgency = data.get('urgency', 'medium')
    # 🔥 VALIDATION
    if not title or not description or not location or not date:
        return Response({"error": "All fields required"}, status=400)
    if urgency not in ['low', 'medium', 'high']:
        return Response({"error": "Invalid urgency"}, status=400)

    try:
        # 🔥 CREATE CAMPAIGN (SAVE TO DB)
        campaign = Campaign.objects.create(
            title=title,
            description=description,
            location=location,
            date=date,
            created_by=user,
            required_skills=required_skills,
            urgency=urgency,
        )

        return Response({
            "message": "Campaign created successfully",
            "campaign_id": campaign.id,
            "title": campaign.title,
            "urgency": campaign.urgency,
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_list(request):
    user = request.user

    if user.role == 'ngo':
        campaigns = Campaign.objects.filter(created_by=user).order_by('-created_at')
    else:
        campaigns = Campaign.objects.filter(status='active').order_by('-created_at')

    data = []

    for c in campaigns:
        data.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "location": c.location,
            "date": str(c.date),
            "created_by": c.created_by.email,
            "required_skills": c.required_skills,
            "urgency": c.urgency,
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_campaigns(request):
    user = request.user
    if user.role == 'volunteer':
        try:
            volunteer = Volunteer.objects.get(user=user)
        except Volunteer.DoesNotExist:
            return Response({"error": "Volunteer profile not found"}, status=404)

        participations = CampaignParticipation.objects.filter(volunteer=volunteer).select_related('campaign')
        data = []
        for participation in participations:
            campaign = participation.campaign
            data.append({
                "campaign_id": campaign.id,
                "title": campaign.title,
                "description": campaign.description,
                "location": campaign.location,
                "required_skills": campaign.required_skills,
                "date": str(campaign.date),
                "status": participation.status,
            })
        return Response(data)

    if user.role != 'ngo':
        return Response({"error": "Only NGO or volunteer allowed"}, status=403)

    campaigns = Campaign.objects.filter(created_by=user).order_by('-created_at')
    response = []

    for campaign in campaigns:
        participations = CampaignParticipation.objects.filter(campaign=campaign)
        response.append({
            "id": campaign.id,
            "title": campaign.title,
            "description": campaign.description,
            "location": campaign.location,
            "required_skills": campaign.required_skills,
            "date": str(campaign.date),
            "urgency": campaign.urgency,
            "total_participants": participations.count(),
            "pending_count": participations.filter(status__in=['waiting', 'pending']).count(),
            "accepted_count": participations.filter(status='accepted').count(),
            "completed_count": participations.filter(status='completed').count(),
        })

    return Response(response)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_participants(request, campaign_id):
    user = request.user

    if user.role != 'ngo':
        return Response({"error": "Only NGO allowed"}, status=403)

    try:
        campaign = Campaign.objects.get(id=campaign_id, created_by=user)
    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)

    participations = CampaignParticipation.objects.filter(campaign=campaign).select_related('volunteer__user')
    data = []
    for participation in participations:
        volunteer = participation.volunteer
        data.append({
            "participation_id": participation.id,
            "volunteer_name": volunteer.user.name,
            "email": volunteer.user.email,
            "skills": volunteer.skills,
            "status": participation.status,
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_participation_status(request):
    user = request.user

    # 🔥 ONLY NGO ALLOWED
    if user.role != 'ngo':
        return Response({"error": "Only NGO allowed"}, status=403)

    participation_id = request.data.get('participation_id')
    action = request.data.get('action')
    status = request.data.get('status')

    if not participation_id or not (action or status):
        return Response({"error": "participation_id and action/status required"}, status=400)

    if action:
        if action == 'accept':
            status = 'accepted'
        elif action == 'reject':
            status = 'rejected'
        elif action == 'complete':
            status = 'completed'
        else:
            return Response({"error": "Invalid action"}, status=400)

    if status not in ['accepted', 'rejected', 'completed']:
        return Response({"error": "Invalid status"}, status=400)

    try:
        participation = CampaignParticipation.objects.get(id=participation_id)
    except CampaignParticipation.DoesNotExist:
        return Response({"error": "Participation not found"}, status=404)

    # 🔥 SECURITY CHECK (VERY IMPORTANT)
    if participation.campaign.created_by != user:
        return Response({"error": "Not your campaign"}, status=403)

    if status == 'completed' and participation.status != 'accepted':
        return Response({"error": "Only accepted can be completed"}, status=400)

    participation.status = status
    participation.save()

    if status == 'completed':
        campaign = participation.campaign
        campaign.status = 'completed'
        campaign.save()

    return Response({
        "message": f"Volunteer {status} successfully"
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_detail(request, campaign_id):
    user = request.user
    if user.role != 'ngo':
        return Response({"error": "Only NGO allowed"}, status=403)

    try:
        campaign = Campaign.objects.get(id=campaign_id, created_by=user)
    except Campaign.DoesNotExist:
        return Response({"error": "Campaign not found"}, status=404)

    participations = CampaignParticipation.objects.filter(campaign=campaign).select_related('volunteer__user')
    grouped = {
        "waiting": [],
        "pending": [],
        "accepted": [],
        "completed": [],
        "rejected": [],
    }

    for participation in participations:
        status = participation.status
        grouped.setdefault(status, [])
        grouped[status].append({
            "participation_id": participation.id,
            "volunteer_name": participation.volunteer.user.name,
            "email": participation.volunteer.user.email,
            "skills": participation.volunteer.skills,
            "status": participation.status,
        })

    return Response({
        "id": campaign.id,
        "title": campaign.title,
        "description": campaign.description,
        "location": campaign.location,
        "required_skills": campaign.required_skills,
        "date": str(campaign.date),
        "urgency": campaign.urgency,
        "participants": grouped,
    })