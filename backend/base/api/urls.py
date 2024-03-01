from django.urls import path
from .views import ObtainTokenView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
   path('', views.get_routes),
   path('token/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
   path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh")
]
