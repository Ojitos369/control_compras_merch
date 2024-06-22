from django.urls import path

from .api import GetNewId

app_name = "api_app"
urlpatterns = [
    path("get_new_id/", GetNewId.as_view(), name=f"{app_name}_get_new_id"),
]