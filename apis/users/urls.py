from django.urls import path

from .api import (
    Login, Register
)

app_name = "api_users"
urlpatterns = [
    path("login/", Login.as_view(), name=f"{app_name}_login"),
    path("register/", Register.as_view(), name=f"{app_name}_register"),
]