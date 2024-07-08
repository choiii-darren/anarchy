from django.db import models

# Create your models here.
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# class User(AbstractUser):
#     pass

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable = False)
    owner = models.ForeignKey("User", on_delete=models.CASCADE)
    original_chat = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='forks')
    created_at = models.DateTimeField(auto_now_add=True)


#idea is that users can use rls to access new chats, then filter all messages for each chat

class User(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=30)
    family_name= models.CharField(max_length=30)
    email = models.CharField(max_length=50)

class Message(models.Model):
    id = models.UUIDField(default=uuid.uuid4,editable = False, primary_key=True)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)
    isUser = models.BooleanField(default=False)

class Permission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    can_edit = models.BooleanField(default=False)
    can_view = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)


