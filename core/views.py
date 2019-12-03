from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate,logout, login
import json, jwt, datetime
# import models
from django.contrib.auth.models import User 
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from .utils import get_or_none, SECRET_KEY,JwtDecode,random_string_generator

def HomePage(request):
  template_name='home.html'
  return render(request,template_name, {'title':'Home'})

def ProfilePage(request):
  template_name='profile.html'
  return render(request,template_name,{'title':'Profile'})


def LoginPage(request):
  template_name='registration/login.html'
  return render(request,template_name, {'title':'Login / Register'})

@csrf_exempt
def LoginV(request):
  if request.method == 'POST':
    print(request.body)
    if not request.body:
      return JsonResponse({"status":400,"Error": "Please provide username/password"})
  
    username = request.POST['username']
    password = request.POST['password']
    # password = check_password(password, )
    try:
      user = authenticate(username=username, password=password)
      if user is not None:
        if user.is_active:
          login(request,user)
          payload = {
            'id': user.id,
            'email': user.email
          }
          details = {
            'id':user.id,
            'email':user.email,
            'username':user.username,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'is_active':user.is_active
          }
          exp = str(datetime.datetime.utcnow() + datetime.timedelta(minutes=120))
          # print(exp)
          jwt_token = {
            "status":200, 
            "token": jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode("utf-8"),
            "detail":details
          }
          print(jwt_token)
          return JsonResponse(jwt_token)
        else:
          return JsonResponse({"status":400, "Error": "Invalid credentials"})
    except User.DoesNotExist:
      return JsonResponse({"status":400, 'Error': "Invalid username/password "+password})
    return JsonResponse({"status":400, "Error": "Invalid credentials"})
  return JsonResponse({"status":405, "Error": "Invalid Method"})

@csrf_exempt
def RegisterV(request):
  if request.method == 'POST':
    if not request.POST:
      return JsonResponse({"status":400,"Error": "Please provide username/password"})
  
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    checkuser = get_or_none(User, email)
    if checkuser:
      return JsonResponse({"status":400,"Error": "User already exist"})
    try:
      User.objects.create(username=username, password=make_password(password), email=email)
      user = User.objects.get(email=email)
      if user:
        payload = {
          'id': user.id,
          'email': user.email,
        }
        details = {
          'id':user.id,
          'email':user.email,
          'username':user.username,
          'first_name':user.first_name,
          'last_name':user.last_name,
          'is_active':user.is_active
        }
        exp = str(datetime.datetime.utcnow() + datetime.timedelta(minutes=120))
        # print(exp)
        jwt_token = {
          "status":201, 
          "token": jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode("utf-8"),
          "detail":details
        }
        return JsonResponse(jwt_token)
      else:
        return JsonResponse({"status":400, "Error": "Invalid credentials"})
    except Exception as e:
      return JsonResponse({"status":400, 'Error': "Registration not successful"})
    return JsonResponse({"status":400, "Error": "Invalid credentials"})
  return JsonResponse({"status":405, "Error": "Invalid Method"})

@csrf_exempt
def LogoutV(request):
  logout(request)
  return JsonResponse({'status':200, 'message':'logged out successfully'})

@csrf_exempt
def PasswordResetV(request):
  if request.method == 'POST':
    print(request.headers)
    if not request.body:
      return JsonResponse({"status":400,"Error": "Please provide an email"})
    email = request.POST['email']
    checkuser = get_or_none(User, email)
    try:
      if checkuser:
        email = checkuser.email
        password = random_string_generator(size=10)
        hash_password = make_password(password)
        user = User.objects.get(email=email)
        user.password=hash_password
        user.save()
        print(password, hash_password)
        current_site = get_current_site(request)
        subject = 'Password Reset Instruction'
        message = render_to_string('registration/password-reset.html', {
          'user': user.username,
          'password': password,
          'domain': current_site.domain,
          })
        user.email_user(subject, message)
        return JsonResponse({"status":200,"message": "Temporary Password Sent"})
      else:
        return JsonResponse({"status":400, "Error": "User doesnt exist"})
    except Exception as e:
      raise e
      return JsonResponse({"status":400, 'Error': "Password reset not successful"})
    return JsonResponse({"status":400, "Error": "Invalid credentials"})
  return JsonResponse({"status":405, "Error": "Invalid Method"})

@csrf_exempt
def ChangePassword(request):
  if request.method == 'POST':
    if not request.body:
      return JsonResponse({"status":400,"Error": "Please provide a password"})
    password = request.POST['password']
    password1 = request.POST['password1']
    checkuser = get_or_none(User, email)
    try:
      if checkuser:
        email = checkuser.email
        password = random_string_generator(size=10)
        hash_password = make_password()
        user = User.objects.get(email=email)
        user.password=hash_password
        user.save()
        print(password, hash_password)
        current_site = get_current_site(request)
        subject = 'Password Reset Instruction'
        message = render_to_string('password-reset.html', {
          'user': user.username,
          'password': password,
          'domain': current_site.domain,
          })
        user.email_user(subject, message)
        return JsonResponse({"status":200,"message": "Temporary Password Sent"})
      else:
        return JsonResponse({"status":400, "Error": "User doesnt exist"})
    except Exception as e:
      return JsonResponse({"status":400, 'Error': "Password reset not successful"})
    return JsonResponse({"status":400, "Error": "Invalid credentials"})
  return JsonResponse({"status":405, "Error": "Invalid Method"})

@csrf_exempt
def ProfileV(request):
  decoded = JwtDecode(request)
  if decoded != "permission denied":
    print(decoded)
    user = User.objects.get(pk=int(decoded['id']), email=decoded['email'])
    return JsonResponse({"status":200, "details":{
      'userid': decoded['id'],
      'username': user.username,
      'email': decoded['email'],
      'firstname': user.first_name,
      'lastname': user.last_name,
    }})
  else:
    return JsonResponse({"status":403, "Error":"Unauthorized access"})
  return JsonResponse({"status":403, "Error":"Unauthorized access"})