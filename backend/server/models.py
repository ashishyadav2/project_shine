from mongoengine import Document, StringField, URLField, ListField
import os

class React(Document):
    card_title = StringField(required=True, max_length=256)
    card_desc = StringField(required=True, max_length=256)
    card_git_link = URLField(required=True, max_length=512)
    card_tags = ListField(StringField()) 
    card_img_id = StringField(max_length=256, null=True) 

    meta = {
        'collection': os.getenv('DB_TABLE', 'react')  
    }
