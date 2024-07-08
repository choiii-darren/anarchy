from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect, get_token
import string
import random
import requests
import datetime
from chats.models import User, Message, Chat, Permission
from django.conf import settings
import jwt
import json
import os
from django.core import serializers

# @ensure_csrf_cookie
def token_ping(request):
    csrftoken = get_token(request)
    response = JsonResponse({"token": csrftoken})
    # response.set_cookie('csrftoken', csrftoken)
    return response

def index(request):
    return Jsonrequest({'body': 'Hello World!'})

def generateString():
    ret = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k = 200)) 
    return ret


#401 unauthorized, 403 forbidden, 404 not found
@csrf_exempt
def addMessage(request):
    #authenticate the JWT
    #get the user from the JWT (decode it)
    if not 'jwt' in request.COOKIES:
        return HttpResponse('No Access Token Provided, please log in again', status=403)

    token = request.COOKIES['jwt']

    # token = request.headers.get('authorization').split(' ')[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.exceptions.InvalidSignatureError:
        raise AuthenticationFailed('Invalid signature')
    except jwt.ExpiredSignatureError:
        return HttpResponse('Token Expired, please log in again', status=401)
    except:
        raise ParseError()

    try:
        #parse message text
        body = json.loads(request.body)
        message = body.get('message')
        #get chat id if null, make new chat obj
    except:
        # return JsonResponse(body,status=404)
        return HttpResponse('Missing message or chatId field', status=404)
    
    user = None
    chat = None
    
    try:
        user = User.objects.get(id=payload['sub'])
    except:
        return HttpResponse('User does not exist', status=404)

    if request.method == "PUT":
        chatId = body.get('chatId')
        chat = Chat.objects.get(id=chatId)
        if chat.owner != user:
            return HttpResponse('User does not have access to this chat', status=401)
    # if Chat.objects.filter(id=chatId).exists():
    elif request.method == "POST":
        user = User.objects.get(id=payload['sub'])
        chat = Chat(owner = user, original_chat = None, created_at = datetime.datetime.now())
        chat.save()
    else:
        return HttpResponse('Wrong RESTFul Request', status=403)

    #make new message, add chatid to foreign key, set timestamp
    newMessage = Message(user=user, chat=chat, content = message, created_at=datetime.datetime.now(),isUser=True)

    #get the generated string
    #make another message, add chatid to foreign key, set timestamp right after the other one
    bot = User.objects.get(id=1)
    botMessage = Message(user=bot, chat=chat, content = generateString(), created_at=datetime.datetime.now() + datetime.timedelta(seconds=1), isUser=False)

    newMessage.save()
    botMessage.save()

    message_json = [{
        'id':newMessage.id, "chat": newMessage.chat.id,"content":newMessage.content,"created_at":newMessage.created_at.isoformat(), "is_user":newMessage.isUser
    },{
        'id':botMessage.id, "chat": botMessage.chat.id,"content":botMessage.content,"created_at":botMessage.created_at.isoformat(), "is_user": botMessage.isUser
    } ]
    
    # message_json = serializers.serialize('json',[botMessage])
    response = JsonResponse(message_json, safe=False)
    #return message object
    return response




def getUserChats(request):
    if request.method != "GET":
        return HttpResponse("Should be a GET request", status=403)

    # token = request.headers.get('authorization').split(' ')[1]
    if not 'jwt' in request.COOKIES:
        return HttpResponse('No Access Token Provided, please log in again', status=403)

    token = request.COOKIES['jwt']

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.exceptions.InvalidSignatureError:
        raise AuthenticationFailed('Invalid signature')
    except jwt.ExpiredSignatureError:
        return HttpResponse('Token Expired, please log in again', status=401)
    except:
        raise ParseError()
    user = User.objects.get(id=payload['sub'])
    data = Chat.objects.filter(owner=user)

    chat_list = [
        {'id':chat.id, 'owner':chat.owner.id,'original_chat': chat.original_chat.id if chat.original_chat else None,'created_at':chat.created_at.isoformat()} for chat in data
    ]
    # response = serializers.serialize('json',data)
    return JsonResponse(chat_list, safe=False)




def getChatMessages(request, chatId):
    if request.method != 'GET':
        return HttpResponse('Should be a GET request', status=403)

    # token = request.headers.get('authorization').split(' ')[1]

    if not 'jwt' in request.COOKIES:
        return HttpResponse('No Access Token Provided, please log in again', status=403)

    token = request.COOKIES['jwt']

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.exceptions.InvalidSignatureError:
        raise AuthenticationFailed('Invalid signature')
    except jwt.ExpiredSignatureError:
        return HttpResponse('Token Expired, please log in again', status=401)
    except:
        raise ParseError()

    if chatId == 'undefined':
        return HttpResponse('Missing chatId field', status=404)
    
    try:
        user = User.objects.get(id=payload['sub'])
    except:
        return HttpResponse('User does not exist', status=404)

    try:
        #check if token matches chatid owner
        if Chat.objects.filter(id=chatId).exists():
            chat = Chat.objects.get(id=chatId)

            if chat.owner != user:
                return HttpResponse('User does not have access to this chat', status=401)
        else:
            return HttpResponse('Chat not found', status=404)
    except:
        return HttpResponse('Missing message or chatId field', status=404)

    data = Message.objects.filter(chat=chat)

    message_list = [{
        'id':message.id,"user":message.user.id, "chat": message.chat.id,"content":message.content,"created_at":message.created_at.isoformat(), "is_user":message.isUser
    }for message in data]
    # data_json = serializers.serializer('json', data)
    return JsonResponse(message_list, safe=False)

def shareChat(request):
    #find chat based on id
    body = request.body
    chatId = body['chatId']
    chat = Chat.objects.get(id=chatId)
    #find user its shared to
    sharedUser = body['sharedEmail']
    #get chat owner 
    user = User.objects.get(id=chat.owner)

    #record the share in perm table
    # perm =
    #give rls 
    
    #return success

# @ensure_csrf_cookie
# @csrf_protect
@csrf_exempt
def authenticate(request):
    if request.method != 'POST':
        return HttpResponse('Must be POST request', status=401)
    # accessToken = request.headers.get('authorization').split(' ')[1]
    body = json.loads(request.body)
    accessToken = body.get('accessToken')

    userInfo = requests.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken).json()

    if 'error' in userInfo and userInfo['error']['code'] == 401:
        return HttpResponse('invalid oauth2 token', status=401)
    else:
        email = userInfo['email']
        userId = int(userInfo['id'])
        first_name = userInfo['given_name']
        last_name = userInfo['family_name']
    
    response = JsonResponse(userInfo)
    #make user so that i can make a jwt from the dude
    currUser = None
    if User.objects.filter(id = userId).exists():
        currUser = User.objects.get(id = userId)
    else:
        currUser = User(id = userId, name = first_name, family_name=last_name, email=email)
        currUser.save()

    # make a jwt for the dude
    #create response and add jwt token information to cookie
    payload = {
        'iss': 'anarchy-backend',
        'iat': datetime.datetime.now(),
        'sub': userId,
        'exp': datetime.datetime.now() + datetime.timedelta(days=5),
        'nbf': datetime.datetime.now(),
        'iat': datetime.datetime.now(),
        'email': email
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    response.set_cookie('jwt', token, max_age=432000, httponly=True, secure=True,samesite='None')

    #they send access token from oauth, we use oauth token to get google details, then we check if email exists in our database, if no, then create user object, else send back a generated token and store email and user id with the object
    
    return response


# class JWTAuthentication():
#     def authenticate(self, request):
#         # Extract the JWT from the Authorization header
#         jwt_token = request.META.get('HTTP_AUTHORIZATION')
#         if jwt_token is None:
#             return None

#         jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token)  # clean the token

#         # Decode the JWT and verify its signature
#         try:
#             payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
#         except jwt.exceptions.InvalidSignatureError:
#             raise AuthenticationFailed('Invalid signature')
#         except:
#             raise ParseError()

#         # Get the user from the database
#         username_or_phone_number = payload.get('user_identifier')
#         if username_or_phone_number is None:
#             raise AuthenticationFailed('User identifier not found in JWT')

#         user = User.objects.filter(username=username_or_phone_number).first()
#         if user is None:
#             user = User.objects.filter(phone_number=username_or_phone_number).first()
#             if user is None:
#                 raise AuthenticationFailed('User not found')

#         # Return the user and token payload
#         return user, payload

#     def authenticate_header(self, request):
#         return 'Bearer'

#     @classmethod
#     def create_jwt(cls, user):
#         # Create the JWT payload
#         payload = {
#             'user_identifier': user.username,
#             'exp': int((datetime.now() + timedelta(hours=settings.JWT_CONF['TOKEN_LIFETIME_HOURS'])).timestamp()),
#             # set the expiration time for 5 hour from now
#             'iat': datetime.now().timestamp(),
#             'username': user.username,
#             'phone_number': user.phone_number
#         }

#         # Encode the JWT with your secret key
#         jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

#         return jwt_token

#     @classmethod
#     def get_the_token_from_header(cls, token):
#         token = token.replace('Bearer', '').replace(' ', '')  # clean the token
#         return token


