from django.urls import path

from .api import GetNewId, GetHostLink, GetUsuarios

app_name = "api_general"
urlpatterns = [
    path("get_new_id/", GetNewId.as_view(), name=f"{app_name}_get_new_id"),
    path("get_host_link/", GetHostLink.as_view(), name=f"{app_name}_get_host_link"),
    path("get_usuarios/", GetUsuarios.as_view(), name=f"{app_name}_get_usuarios"),
]