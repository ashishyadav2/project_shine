from io import BytesIO
import json
import re
from django.http import Http404, HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from . serializer import *
from pymongo import MongoClient
import gridfs
from bson import ObjectId
from server.db_con_util.db_conn_class import DBConnect
# from server.Logger.logger_util import logging
from dotenv import load_dotenv
load_dotenv()

DEFAULT_IMG_URL = f'{os.getenv("HOST_NAME_REACT")}/src/assets/image_placeholder.jpg'

class ReactView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    grid_bucket = db_obj.get_grid_bucket()
    
    def get(self, request):
        all_documents = self.collection.find()
        output = []
        for doc in all_documents:
            img_id = doc.get("card_img_id", "")
            img_url = f'{os.getenv("HOST_NAME")}/api/image/fetch/{img_id}/' if img_id else DEFAULT_IMG_URL
            output.append({
                "card_id": str(doc.get("_id", "")),
                "card_title": doc.get("card_title", ""),
                "card_desc": doc.get("card_desc", ""),
                "card_git_link": doc.get("card_git_link", ""),
                "card_tags": doc.get("card_tags", []),
                "card_img_id": doc.get("card_img_id",""),
                "card_img_url": img_url
            })
        return Response(output)
        
    def post(self, request):
        self.db_obj.start_session()
        response = None
        try:
            self.db_obj.start_transaction()
            print(f"from copy: {request.data}")
            isCopyMode = request.data.get("isCopyMode",False)
            img_id = request.data.get("card_img_id","")
            new_img_id = None
            if isCopyMode and img_id!="":
                try:
                    existing_img_file = self.gfs.get(ObjectId(img_id))
                    img_bin_data = existing_img_file.read()
                    img_copy_count = 1
                    try:
                        img_copy_count = int(existing_img_file.filename.split("_")[-1])
                    except Exception as e:
                        pass
                    new_image_name = f"{existing_img_file.filename}_{img_copy_count}"
                    new_img_id = self.gfs.put(
                        img_bin_data,
                        filename=new_image_name,
                        contentType=existing_img_file.content_type,
                        metadata=existing_img_file.metadata)
                    request.data["card_img_id"] = str(new_img_id)
                    del request.data["isCopyMode"]
                    print(request.data)
                except Exception as ex:
                    self.db_obj.rollback_transaction()
                    response = Response({"message": "Cannot create copy"})
                    print(ex)
            serializer = ReactSerializer(data=request.data)
            if serializer.is_valid(raise_exception = True):
                serializer.save()
                response = Response(serializer.data)
                self.db_obj.commit_transaction()
        except Exception as exp:
            print(exp)
            if new_img_id:
                try:
                    self.gfs.delete(new_img_id)
                    print(f"Rolled back GridFS file: {new_img_id}")
                except Exception as cleanup_err:
                    print(f"WARNING: failed to cleanup GridFS file {new_img_id}: {cleanup_err}")
            response = Response({"message": "Transaction failed"}, status=500)
        finally:
            self.db_obj.end_session()
        return response
        
    def delete(self,request):
        try:
            post_id = request.data.get("card_id",None)
            img_id = request.data.get("img_id",None)
            existing_record = None
            print(request.data)
            if img_id:
                isImageDeleted = self.gfs.delete(ObjectId(img_id))
                print(f"{img_id, isImageDeleted}")
                if isImageDeleted is None:
                    existing_record = self.collection.delete_one({"_id": ObjectId(post_id)})
                    print(f"{existing_record}")
            else:
                existing_record = self.collection.delete_one({"_id": ObjectId(post_id)})
            return Response({"message": f"data deleted from server-> {existing_record!=None}"})
        except Exception as ex:
            return Response({"message": "error occurred"})
            
    def patch(self,request,form_doc_id=None):
        print(f"Form Data>> {request.data}, form_id>> {form_doc_id}\n")
        response_obj = {"message":"","status":200}
        try:
            existing_record = self.collection.find_one({"_id": ObjectId(form_doc_id)})
            if existing_record:                
                print(f"DB>> {existing_record}\n")
                update_fields = {}
                update_fields["card_title"] = request.data.get("title","")
                update_fields["card_desc"] = request.data.get("desc","")
                update_fields["card_git_link"] = request.data.get("github_url","")
                tags = request.data.get("tags", "")
                if isinstance(tags, str) and tags.strip():
                    update_fields["card_tags"] = re.split(r'\s*,\s*', tags)
                elif isinstance(tags, list):
                    update_fields["card_tags"] = [tag for tag in tags if tag.strip()] or ["untagged"]
                else:
                    update_fields["card_tags"] = ["untagged"]
                 
                new_img_id = request.data.get("new_img_id","")
                old_img_id = request.data.get("old_img_id","")
                isImageRemoved = request.data.get("is_img_removed",False)
                existing_card_img_id = existing_record.get("card_img_id") 
                
                if  new_img_id!="": #if new img is present
                    if existing_card_img_id!="": # delete existing image
                        isImageDeleted = self.gfs.delete(ObjectId(existing_card_img_id))
                        if isImageDeleted is None:
                            update_fields["card_img_id"] = new_img_id                
                    else: #current image is absent, inserting new image
                        update_fields["card_img_id"] = new_img_id                
                elif isImageRemoved:
                    if existing_card_img_id!="": # delete existing image
                        isImageDeleted = self.gfs.delete(ObjectId(existing_card_img_id))
                        if isImageDeleted is None:
                            update_fields["card_img_id"] = ""                  
                elif old_img_id == "": #if image is removed
                    update_fields["card_img_id"] = "" 
                    
                print(f"modified fields>> {update_fields}")
                result = self.collection.update_one(
                            {"_id": ObjectId(form_doc_id)},
                            {"$set": update_fields}
                        )
                if result.modified_count > 0:
                    print("Record updated successfully")
                    response_obj["message"] = "Record updated successfully"
                    response_obj["status"] = 200
                else:
                    print("No changes made to the record")
                    response_obj["message"] = "No changes made to the record"
                    response_obj["status"] = 200
            else:
                response_obj["message"] = "Record"
                response_obj["status"] = 404
        except Exception as e:
            print(e)
            response_obj["message"] = "Internal server error"
            response_obj["status"] = 500
        return Response(response_obj,status=response_obj.get("status"))
      
class RealTimeSearchView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    
    def get(self,request):            
        query = request.GET.get('q', '')
        if not query:
            return Response([])
        results = list(self.collection.find({ "$text": { "$search": query } }).limit(10))  
        print(results)
        for item in results:
            item["_id"] = str(item["_id"])           
            item["card_img_url"] = f'{os.getenv("HOST_NAME")}/api/image/fetch/{item.get("card_img_id","")}/'
        return Response(results)
    
class ImageUploadView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    flag = True
    def get(self, request, image_id):
        try:
            file = self.gfs.get(ObjectId(image_id))
            response = HttpResponse(file.read(), content_type=file.content_type)
            response['Content-Disposition'] = f'inline; filename="{file.filename}"'
            return response
        except:
            return HttpResponse("Image not found", status=404)
    
    def post(self,request):
        image_file = request.FILES.get("imageFile")
        print(image_file)
        if not image_file:
            return Response({"error": "Image file is required"}, status=400)        
        file_id = self.gfs.put(image_file, filename=image_file.name, content_type=image_file.content_type)
        res = {"_id" : str(file_id)}
        return Response(res)