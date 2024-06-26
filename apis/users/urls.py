from django.urls import path

from .api import (
    Login, Register, ValidarCuenta, ValidarSesion, 
)

app_name = "api_users"
urlpatterns = [
    path("login/", Login.as_view(), name=f"{app_name}_login"),
    path("register/", Register.as_view(), name=f"{app_name}_register"),
    path("validar_cuenta/", ValidarCuenta.as_view(), name=f"{app_name}_validar_cuenta"),
    path("validar_sesion/", ValidarSesion.as_view(), name=f"{app_name}_validar_sesion"),
]