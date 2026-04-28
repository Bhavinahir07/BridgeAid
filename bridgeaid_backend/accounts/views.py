from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ngo.models import NGO
from volunteer.models import Volunteer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ngo.models import NGO
from volunteer.models import Volunteer


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user

    # 🟢 GET → fetch profile
    if request.method == "GET":
        if user.role == "ngo":
            ngo = NGO.objects.get(user=user)
            return Response({
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "organization_name": ngo.organization_name,
                "address": ngo.address,
                "registration_number": ngo.registration_number
            })

        elif user.role == "volunteer":
            volunteer = Volunteer.objects.get(user=user)
            return Response({
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "skills": volunteer.skills,
                "location": volunteer.location,
                "availability": volunteer.availability
            })

    # 🔵 PUT → update profile
    elif request.method == "PUT":
        data = request.data

        if user.role == "ngo":
            ngo = NGO.objects.get(user=user)
            ngo.organization_name = data.get('organization_name', ngo.organization_name)
            ngo.address = data.get('address', ngo.address)
            ngo.registration_number = data.get('registration_number', ngo.registration_number)
            ngo.save()

            return Response({"message": "NGO profile updated"})

        elif user.role == "volunteer":
            volunteer = Volunteer.objects.get(user=user)
            volunteer.skills = data.get('skills', volunteer.skills)
            volunteer.location = data.get('location', volunteer.location)
            volunteer.availability = data.get('availability', volunteer.availability)
            volunteer.save()

            return Response({"message": "Volunteer profile updated"})

    return Response({"error": "Invalid request"}, status=400)
# 🔥 TOKEN FUNCTION
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# 🔥 SIGNUP API
from ngo.models import NGO
from volunteer.models import Volunteer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User
from ngo.models import NGO
from volunteer.models import Volunteer
from rest_framework_simplejwt.tokens import RefreshToken


# 🔥 TOKEN FUNCTION
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password')
    role = data.get('role')

    # 🔥 VALIDATION
    if not name or not email or not password or not role:
        return JsonResponse({'error': 'All fields required'}, status=400)

    if role not in ['ngo', 'volunteer']:
        return JsonResponse({'error': 'Invalid role'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)

    try:
        # 🔥 CREATE USER
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            role=role
        )

        # 🔥 CREATE PROFILE (IMPORTANT FIX)
        if role == "ngo":
            NGO.objects.create(user=user)

        elif role == "volunteer":
            Volunteer.objects.create(user=user)

        # 🔥 AUTO LOGIN (TOKEN)
        tokens = get_tokens_for_user(user)

        return JsonResponse({
            'message': 'User created successfully',
            'email': user.email,
            'role': user.role,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# 🔥 LOGIN API (UPDATED WITH JWT)
@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = data.get('email', '').strip()
        password = data.get('password')

        if not email or not password:
            return JsonResponse({"error": "Email and password required"}, status=400)

        user = authenticate(request, email=email, password=password)

        if user is None:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

        # 🔥 GENERATE TOKENS
        tokens = get_tokens_for_user(user)

        return JsonResponse({
            "message": "Login successful",
            "email": user.email,
            "role": user.role,
            "access_token": tokens['access'],
            "refresh_token": tokens['refresh']
        })

    return JsonResponse({"error": "Only POST allowed"}, status=405)