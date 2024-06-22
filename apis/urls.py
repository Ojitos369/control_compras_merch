from django.urls import path, include

app_name = 'apis'
urlpatterns = [
    path('app/', include('apis.app.urls')),
    path('general/', include('apis.general.urls')),
    path('users/', include('apis.users.urls')),
]
