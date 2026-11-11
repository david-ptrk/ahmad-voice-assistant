from django.urls import path
from .views import ask_assistant

urlpatterns = [
    path("ask/", ask_assistant, name="ask_assistant"),
]