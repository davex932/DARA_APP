from django.urls import path
from . import views

urlpatterns= [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('home/', views.home, name='home'),
    path('upload/', views.upload, name='upload'),
    path('profile/', views.profile, name='profile'),
    path('explore/', views.explore, name='explore'),
    path('logout/', views.logout_user, name='logout')
]