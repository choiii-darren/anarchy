"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from oauth2_provider import urls as oauth2_urls

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('hello', views.index, name='index'), #at app/hello
    # path("o/", include(oauth2_urls)),
    path('api/response', views.generateString, name='generate-string'),
    path('api/token_ping',views.token_ping, name="token_ping"),
    path('api/add_message',views.addMessage, name='addMessage'),
    path('api/authenticate', views.authenticate,name='authenticate'),
    path('api/user_chats',views.getUserChats,name='getUserChats'),
    path('api/chat_messages/<uuid:chatId>', views.getChatMessages,name='getChatMessages'),
    path('api/share_chat', views.shareChat, name='shareChat')
]
