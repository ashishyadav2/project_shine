
from django.contrib import admin
from django.urls import path
from server.views import ReactView, ImageUploadView, RealTimeSearchView, GetTags, AdminMgmt
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/view_create_post/',ReactView.as_view(),name='form_data'),
    path('api/delete_post/',ReactView.as_view(),name='form_data_delete'),
    path('api/update_post/<str:form_doc_id>/',ReactView.as_view(),name='form_data_update'),
    path('api/image/upload/',ImageUploadView.as_view(),name='image_upload'),
    path('api/image/fetch/<str:image_id>/',ImageUploadView.as_view(),name='image_fetch'),
     path("api/search/", RealTimeSearchView.as_view(), name="search"),
     path("api/get_tags/", GetTags.as_view(), name="get_tags"),
     path("ashish/", AdminMgmt.as_view(), name="admin_login"),
     
]
