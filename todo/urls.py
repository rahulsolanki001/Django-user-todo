from django.urls import path
from .views import RegisterView,LoginView,DashboardView,LogoutView,TodoGetView,TodoPostView,TodoDeleteView,TodoUpdateView

urlpatterns=[
    path('register',RegisterView.as_view()),
    path('login',LoginView.as_view()),
    path('dashboard',DashboardView.as_view()),
    path('logout',LogoutView.as_view()),
    path('todo',TodoGetView.as_view()),
    path('todo/new',TodoPostView.as_view()),
    path('todo/<int:id>/',TodoDeleteView,name='delete'),
    path('todo/update/<int:id>/',TodoUpdateView,name='update')
]