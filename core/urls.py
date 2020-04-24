from django.urls import path
from core import views as core_views


urlpatterns = [
    path('', core_views.home, name="home"),
    path('grafos/', core_views.grafos, name="grafos"),
    path('nosotros/', core_views.nosotros, name="nosotros"),
]