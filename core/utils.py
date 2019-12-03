import jwt, json, random, string, os

SECRET_KEY = os.getenv('SECRET_KEY')

def get_or_none(Model, value):
  try:
    user = Model.objects.get(email=value)
    return user
  except Exception as e:
    return None

def JwtDecode(request):
  try:
    print(request.headers)
    token = request.headers['Authorization'].split(' ')[1]
    decoded = jwt.decode(token, SECRET_KEY, algorithms='HS256')
    return decoded
  except Exception as e:
    raise e
    return "permission denied"

def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
