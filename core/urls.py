from django.conf.urls import url
from django.urls import path
from django.contrib.auth import views as auth_views
from .views import HomePage, ProfilePage, LoginPage, LoginV, RegisterV, LogoutV, ProfileV, PasswordResetV

app_name='core'

urlpatterns = [
  path('', HomePage, name='home'),
  path('accounts', LoginPage, name='accounts'),
  path('profile', ProfilePage, name='profile'),
  path('login', LoginV, name='login'),
  path('logout', LogoutV, name='logout'),
  path('register', RegisterV, name='register'),
  path('user-profile', ProfileV, name='profilev'),
  path('reset-password', PasswordResetV, name='reset_password'),
]

