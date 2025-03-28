# scribe/urls.py
from django.urls import path
from .views import transcribe_api

urlpatterns = [
    path('transcribe/', transcribe_api, name='hello'),
]