from django.urls import path
from .views import signup, login, profile

urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('profile/', profile),
]
