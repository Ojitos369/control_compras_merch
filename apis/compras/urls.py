from django.urls import path

from .api import (
    GuardarImagen, ValidarImagenesNoGuardadas, GuardarCompra, 
    GetMyCompras, GetCompra, GuardarCargo, GuardarPago, ValidarPago, 
    EliminarImagen, EliminarCompra, 
)

app_name = "api_compras"
urlpatterns = [
    path("guardar_imagen/", GuardarImagen.as_view(), name=f"{app_name}_guardar_imagen"),
    path("validar_imagenes_no_guardadas/", ValidarImagenesNoGuardadas.as_view(), name=f"{app_name}_validar_imagenes_no_guardadas"),
    path("guardar_compra/", GuardarCompra.as_view(), name=f"{app_name}_guardar_compra"),
    path("get_my_compras/", GetMyCompras.as_view(), name=f"{app_name}_get_my_compras"),
    path("get_compra/", GetCompra.as_view(), name=f"{app_name}_get_compra"),
    path("guardar_cargo/", GuardarCargo.as_view(), name=f"{app_name}_guardar_cargo"),
    path("guardar_pago/", GuardarPago.as_view(), name=f"{app_name}_guardar_pago"),
    path("validar_pago/", ValidarPago.as_view(), name=f"{app_name}_validar_pago"),
    path("eliminar_imagen/", EliminarImagen.as_view(), name=f"{app_name}_eliminar_imagen"),
    path("eliminar_compra/", EliminarCompra.as_view(), name=f"{app_name}_eliminar_compra"),
]