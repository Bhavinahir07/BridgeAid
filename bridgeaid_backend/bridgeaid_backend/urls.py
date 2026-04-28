from django.urls import path, include

urlpatterns = [
    path('api/', include('accounts.urls')),
    path('api/', include('ngo.urls')),
    path('api/', include('volunteer.urls')),
]
