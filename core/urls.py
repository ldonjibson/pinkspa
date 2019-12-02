from django.conf.urls import url
from django.urls import path
from django.contrib.auth import views as auth_views
from .views import HomePage, ProfilePage, LoginPage, LoginV, RegisterV, PasswordResetV

app_name='core'

urlpatterns = [
  path('', HomePage, name='home'),
  path('login-register', LoginPage, name='login_register'),
  path('profile', ProfilePage, name='profile'),
  path('login', LoginV, name='login'),
  path('register', RegisterV, name='register'),
  path('reset-password', PasswordResetV, name='reset_password'),
]
