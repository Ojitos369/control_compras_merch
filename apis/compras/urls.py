from django.urls import path

from .api import (
    GuardarImagen, ValidarImagenesNoGuardadas
)

app_name = "api_compras"
urlpatterns = [
    path("guardar_imagen/", GuardarImagen.as_view(), name=f"{app_name}_guardar_imagen"),
    path("validar_imagenes_no_guardadas/", ValidarImagenesNoGuardadas.as_view(), name=f"{app_name}_validar_imagenes_no_guardadas"),
]