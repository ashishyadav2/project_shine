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
from server.Logger.logger_util import Logger
from dotenv import load_dotenv
load_dotenv()

class ReactView(APIView):
    # serializer_class = ReactSerializer
    # def get(self, request):
    #     output = [{'card_title': output.card_title,"card_desc": output.card_desc, "card_git_link": output.card_git_link, "card_tags":output.card_tags} for output in React.objects.all()]
    #     return Response(output)
    
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    
    def get(self, request):
        documents = self.collection.find()
        output = []
        for doc in documents:
            img_id = doc.get("card_img_id", "")
            img_url = f"http://localhost:8000/image/{img_id}/" if img_id else ""
            if img_url == "":
                img_url = "http://localhost:5173/src/assets/image_placeholder.jpg"
            # if doc.get("img_url","").endswith("image_placeholder.jpg"):
            #     img_url = doc.get("img_url")
            output.append({
                "card_id": str(doc.get("_id", "")),
                "card_title": doc.get("card_title", ""),
                "card_desc": doc.get("card_desc", ""),
                "card_git_link": doc.get("card_git_link", ""),
                "card_tags": doc.get("card_tags", []),
                "card_img_id": img_url
            })
        # for obj in output:
        #     print(f"get: {obj}\n\n")
        return Response(output)
        
    def post(self, request):
        print(f"from copy: {request.data}")
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception = True):
            serializer.save()
            return Response(serializer.data)
        
    def delete(self,request):
        try:
            card_id = request.data["card_id"]
            img_id = None
            if not img_id:
                try:
                    img_id = request.data["img_id"].split("/")[-2]
                    print(img_id)
                    isImageDeleted = self.gfs.delete(ObjectId(img_id))
                    if not isImageDeleted:
                        existing_record = self.collection.delete_one({"_id": ObjectId(card_id)})
                except Exception as exp:
                    existing_record = self.collection.delete_one({"_id": ObjectId(card_id)})
                
            else:
                existing_record = self.collection.delete_one({"_id": ObjectId(card_id)})
            return Response({"message": f"data deleted from server-> {existing_record!=None}"})
        except Exception as ex:
            print(ex)
            return Response({"message": "error occurred"})
            
    def patch(self,request,form_doc_id):
        print(f"Form Data>> {request.data}, form_id>> {form_doc_id}\n")
        success_flag = False
        try:
            existing_record = self.collection.find_one({"_id": ObjectId(form_doc_id)})
            if existing_record:                
                print(f"DB>> {existing_record}\n")
                update_fields = {}
                update_fields["card_title"] = request.data.get("title","")
                update_fields["card_desc"] = request.data.get("desc","")
                update_fields["card_git_link"] = request.data.get("github_url","")
                update_fields["card_tags"] = request.data.get("tags","")
                tags = request.data.get("tags", "")
                if isinstance(tags, str) and tags.strip():
                    update_fields["card_tags"] = re.split(r'\s*,\s*', tags)
                elif isinstance(tags, list):
                    update_fields["card_tags"] = [tag for tag in tags if tag.strip()] or ["No category"]
                else:
                    update_fields["card_tags"] = ["untagged"]
                 
                form_data_img_url = request.data.get("img_url","")
                if form_data_img_url.endswith("image_placeholder.jpg"):
                    update_fields["img_url"] = "http://localhost:5173/src/assets/image_placeholder.jpg"
                    
                print(f"modified fields>> {update_fields}")  
                # case : not image change 0
                # case: new image uploaded 1
                # case: image removed 2
                imageMode = -1
                if not str(request.data["img_url"]).endswith("image_placeholder.jpg"):
                    old_url_arr = request.data["img_url"].split(":")
                    old_img_id = old_url_arr[2].split("/")[-2]
                    default_img_id = old_url_arr[2].split("/")[-1]
                    isImageDeleted = False
                    new_img_id = None
                    if len(old_url_arr)==3:
                        imageMode = 0
                    elif len(old_url_arr)==4:
                        imageMode = 1
                        new_img_id = old_url_arr[-1]
                    else:
                        imageMode = 2
                    try:
                        print(f"old_url_arr: {old_url_arr}")
                        print(f"Old img id, {old_img_id}")
                        if imageMode in [1,2]:
                            if imageMode==1 and (not new_img_id):
                                update_fields["card_img_id"] = new_img_id
                            elif imageMode==2:
                                update_fields["card_img_id"] = ""
                            isImageDeleted = self.gfs.delete(ObjectId(old_img_id))
                            print(f"is image deleted: {isImageDeleted}")
                            
                    except Exception as ex:
                        print(f"Exception: {ex}\n")
                    if isImageDeleted:
                        print(f"\nmodified fields image>> {update_fields}")                   
                        result = self.collection.update_one(
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
                    result = self.collection.update_one(
                        {"_id": ObjectId(form_doc_id)},
                        {"$set": update_fields}
                    )
                    if result.modified_count > 0:
                        print("Record updated successfully")
                        return Response({"message": "Record updated successfully"})
                    else:
                        print("No changes made to the record")
                        return Response({"message": "No changes made to the record"})
                    
            # if success_flag:
            #     return Response({"message": "all operation done successfully"}, status=200)
            return Response({"error": "Record not found"}, status=404)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=500)
      
class RealTimeSearchView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    def get(self,request):            
        query = request.GET.get('q', '')
        if not query:
            return Response([])        
        # regex = re.compile(f".*{re.escape(query)}.*", re.IGNORECASE)
        # regex = {
        # "$text": {
        #             "$search": query
        #         }}
        results = list(self.collection.find({ "$text": { "$search": query } }).limit(10))  
        print(results)
        for item in results:
            item["_id"] = str(item["_id"])           
            item["card_img_id"] = f'http://localhost:8000/image/{item.get("card_img_id","")}/'
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
            flag = False
            # raise Http404("Image not found")
            return HttpResponse("Image not found", status=404)
    
    def post(self,request):
        image_file = request.FILES.get("imageFile")
        if not image_file:
            return Response({"error": "Image file is required"}, status=400)        
        file_id = self.gfs.put(image_file, filename=image_file.name, content_type=image_file.content_type)
        res = {"_id" : str(file_id)}
        return Response(res)