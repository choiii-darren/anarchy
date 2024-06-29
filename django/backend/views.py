from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import string
import random

@ensure_csrf_cookie
def token_ping(request):
    return JsonResponse({"token": "enjoy"})

def index(response):
    return JsonResponse({'body': 'Hello World!'})

def generateString(response):
    ret = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k = 200))
    return JsonResponse({'response':ret})

