from django.urls import path, include

app_name = 'apis'
urlpatterns = [
    path('app/', include('apis.app.urls')),
    path('general/', include('apis.general.urls')),
    path('users/', include('apis.users.urls')),
    path('compras/', include('apis.compras.urls')),
    path('gasto_grupal/', include('apis.gasto_grupal.urls')),
]
