from django.urls import path

from .api import HelloWorld

app_name = "api_app"
urlpatterns = [
    path("hello_world/", HelloWorld.as_view(), name=f"{app_name}_hello_world"),
]