
from django.contrib import admin
from django.urls import path
from server.views import ReactView, ImageUploadView, RealTimeSearchView, GetTags, LogoutView, LoginView, CheckAuthView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls import handler404
from django.shortcuts import render

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/view_create_post/',ReactView.as_view(),name='form_data'),
    path('api/delete_post/',ReactView.as_view(),name='form_data_delete'),
    path('api/update_post/<str:form_doc_id>/',ReactView.as_view(),name='form_data_update'),
    path('api/image/upload/',ImageUploadView.as_view(),name='image_upload'),
    path('api/image/fetch/<str:image_id>/',ImageUploadView.as_view(),name='image_fetch'),
    path("api/search/", RealTimeSearchView.as_view(), name="search"),
    path("api/get_tags/", GetTags.as_view(), name="get_tags"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', LoginView.as_view(), name='login_view'),
    path('api/logout/', LogoutView.as_view(), name='logout_view'),
    path('api/isloggedin/', CheckAuthView.as_view(), name='isloggedin_view'),
]

def custom_404(request, exception):
    return render(request, "404.html", status=404)

handler404 = custom_404
