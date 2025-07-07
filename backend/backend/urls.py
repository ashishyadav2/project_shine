
from django.contrib import admin
from django.urls import path, include
from server.views import *
from django.conf.urls import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',ReactView.as_view(),name='form_data'),
    path('api/delete/',ReactView.as_view(),name='form_data_delete'),
    path('api/<str:form_doc_id>/',ReactView.as_view(),name='form_data_update'),
    path('imageUpload/',ImageUploadView.as_view(),name='image_upload'),
    path('image/<str:image_id>/',ImageUploadView.as_view(),name='image_fetch')
]
