import json
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from . serializer import *
from pymongo import MongoClient
import gridfs
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()

class ReactView(APIView):
    # serializer_class = ReactSerializer
    # def get(self, request):
    #     output = [{'card_title': output.card_title,"card_desc": output.card_desc, "card_git_link": output.card_git_link, "card_tags":output.card_tags} for output in React.objects.all()]
    #     return Response(output)
    
    def get(self, request):
        client = MongoClient(os.getenv("DB_URI")) 
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("DB_TABLE")]  
        documents = collection.find()
        output = []
        for doc in documents:
            img_id = doc.get("card_img_id", "")
            img_url = f"http://localhost:8000/image/{img_id}/" if img_id else ""
            output.append({
                "card_id": str(doc.get("_id", "")),
                "card_title": doc.get("card_title", ""),
                "card_desc": doc.get("card_desc", ""),
                "card_git_link": doc.get("card_git_link", ""),
                "card_tags": doc.get("card_tags", []),
                "card_img_id": img_url
            })
        return Response(output)
        
    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return Response(serializer.data)
        
    def delete(self,request):
        try:
            client = MongoClient(os.getenv("DB_URI")) 
            db = client[os.getenv("DB_NAME")]
            collection = db[os.getenv("DB_TABLE")]  
            client = MongoClient(os.getenv("DB_URI")) 
            gfs = gridfs.GridFS(db)
            card_id = request.data["card_id"]
            img_id = None
            if not img_id:
                try:
                    img_id = request.data["img_id"].split("/")[-2]
                    print(img_id)
                    isImageDeleted = gfs.delete(ObjectId(img_id))
                    if not isImageDeleted:
                        existing_record = collection.delete_one({"_id": ObjectId(card_id)})
                except Exception as exp:
                    existing_record = collection.delete_one({"_id": ObjectId(card_id)})
                
            else:
                existing_record = collection.delete_one({"_id": ObjectId(card_id)})
            return Response({"message": f"data deleted from server-> {existing_record!=None}"})
        except Exception as ex:
            print(ex)
            return Response({"message": "error occurred"})
            
    def patch(self,request,form_doc_id):
        print(request.data, form_doc_id)
        try:
            client = MongoClient(os.getenv("DB_URI")) 
            db = client[os.getenv("DB_NAME")]
            collection = db[os.getenv("DB_TABLE")]  
            gfs = gridfs.GridFS(db)
            existing_record = collection.find_one({"_id": ObjectId(form_doc_id)})
            if existing_record:                
                print(existing_record)
                update_fields = {}
                update_fields["card_title"] = request.data["title"]
                update_fields["card_desc"] = request.data["desc"]
                update_fields["card_git_link"] = request.data["github_url"]
                update_fields["card_tags"] = request.data["tags"]
                if not str(request.data["img_url"]).endswith("image_placeholder.jpg"):
                    old_url_arr = request.data["img_url"].split(":")
                    isImageDeleted = False
                    try:
                        old_img_id = old_url_arr[2].split("/")[-2]
                        new_img_id = old_url_arr[-1]
                        update_fields["card_img_id"] = new_img_id
                        isImageDeleted = gfs.delete(ObjectId(old_img_id))
                    except Exception as ex:
                        pass
                    if not isImageDeleted:
                        old_url_arr = request.data["img_url"].split(":")
                        new_img_id = old_url_arr[-1]
                        update_fields["card_img_id"] = new_img_id                   
                        result = collection.update_one(
                            {"_id": ObjectId(form_doc_id)},
                            {"$set": update_fields}
                        )
                        if result.modified_count > 0:
                            print("Record updated successfully")
                            return Response({"message": "Record updated successfully along with image"})
                        else:
                            print("No changes made to the record")
                            return Response({"message": "No changes made to the record along with image"})
                else:          
                    result = collection.update_one(
                        {"_id": ObjectId(form_doc_id)},
                        {"$set": update_fields}
                    )
                    if result.modified_count > 0:
                        print("Record updated successfully")
                        return Response({"message": "Record updated successfully"})
                    else:
                        print("No changes made to the record")
                        return Response({"message": "No changes made to the record"})

            return Response({"error": "Record not found"}, status=404)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=500)
        
class ImageUploadView(APIView):
    db_client = MongoClient(os.getenv("DB_URI"))
    db = db_client[os.getenv("DB_NAME")]
    gfs = gridfs.GridFS(db)
    def get(self, request, image_id):
        try:
            file = self.gfs.get(ObjectId(image_id))
            response = HttpResponse(file.read(), content_type=file.content_type)
            response['Content-Disposition'] = f'inline; filename="{file.filename}"'
            return response
        except:
            raise Http404("Image not found")
    
    def post(self,request):
        image_file = request.FILES.get("imageFile")
        if not image_file:
            return Response({"error": "Image file is required"}, status=400)        
        file_id = self.gfs.put(image_file, filename=image_file.name, content_type=image_file.content_type)
        res = {"_id" : str(file_id)}
        return Response(res)