from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# =======================
# User Manager
# =======================
class UserManager(BaseUserManager):

    def create_user(self, email, name, password=None, role='ngo'):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            name=name,
            role=role
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, name, password):
        user = self.create_user(
            email=email,
            name=name,
            password=password,
            role='ngo'
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


# =======================
# User Model
# =======================
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ('ngo', 'NGO'),
        ('volunteer', 'Volunteer'),
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ngo')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.email} ({self.role})"