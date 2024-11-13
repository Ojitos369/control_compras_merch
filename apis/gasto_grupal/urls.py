from django.urls import path

from .api import (
    Test,
    GetCompras, 
)

app_name = "api_gasto_grupal"
urlpatterns = [
    path("test/", Test.as_view(), name=f"{app_name}_test"),
    path("get_compras/", GetCompras.as_view(), name=f"{app_name}_get_compras"),
]