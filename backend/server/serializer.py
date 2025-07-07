from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import React

class ReactSerializer(DocumentSerializer):
    class Meta:
        model = React
        fields = ['card_title', 'card_desc', 'card_git_link', 'card_tags', 'card_img_id']
