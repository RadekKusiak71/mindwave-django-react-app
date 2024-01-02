from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet,PostViewSet,FriendsRequestsViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Initializing router for views
router = DefaultRouter()

# Routing for endpoints
router.register(r'profiles',ProfileViewSet,basename='profile')
router.register(r'posts',PostViewSet,basename='post')
router.register(r'friends',FriendsRequestsViewSet,basename='friends')

urlpatterns = [
    # jwtoken views for obtaining token and refresing
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += router.urls