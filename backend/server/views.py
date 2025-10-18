#region imports
import os
import re
import time
import json
import random
from io import BytesIO
from datetime import datetime, date

from PIL import Image
from bson import ObjectId
from pymongo import MongoClient, UpdateOne
import gridfs
from dotenv import load_dotenv
load_dotenv()

from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
from .serializer import *
from server.db_con_util.db_conn_class import DBConnect
from server.Logger.logger_util import log, aprint
#endregion

DEFAULT_IMG_URL = f'{os.getenv("HOST_NAME_REACT")}/src/assets/image_placeholder.jpg'
CARDS_PER_PAGE = 6

class ImageUtilities:
    def __init__(self):
        pass
    def compress_image(self,uncompressed_image,isBin=0,quality=65,target_kb=400):
        try:
            log("debug","start")
            img = None
            if isBin==1:
                img = Image.open(BytesIO(uncompressed_image))
                log("info",f"From copy button isBin: {1}")
                aprint("From copy button")
            else:
                img = Image.open(uncompressed_image)   
                log("info",f"from add project isBin: {1}")
                aprint("from add project")
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            compressed_img = BytesIO()
            img.save(compressed_img,format="JPEG",quality=60,optimize=True)
            compressed_img.seek(0)
            size_kb = compressed_img.getbuffer().nbytes / 1024
            while size_kb > target_kb and quality > 10:
                quality -= 5
                compressed_img = BytesIO()
                img.save(compressed_img, format="JPEG", quality=quality, optimize=True)
                compressed_img.seek(0)
                size_kb = compressed_img.getbuffer().nbytes / 1024
                aprint(f"Retry compressing: {size_kb:.2f} KB at quality {quality}")
            log("info",f"Image compressed at: {size_kb:.2f} KB at quality {quality}")
            log("debug","end")
            return compressed_img
        except Exception as e:
            log("error",str(e))
            aprint(e)
        return None
    
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access_token")
        if not raw_token:
            return None
        try:
            log("debug","start")
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            log("info","successfully authenticated token")
            log("debug","end")
            return (user, validated_token)
        except Exception as e:
            log("error",str(e))
            return None
   
class ReactView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    tag_collection = db_obj.get_collection(collection_name="TAGS_TABLE")
    gfs = db_obj.get_grid_fs()
    grid_bucket = db_obj.get_grid_bucket()
    img_util = ImageUtilities()
    
    authentication_classes = [CookieJWTAuthentication]
    def get_permissions(self):
        log("debug","start")
        if self.request.method == 'GET':
            log("debug","end")
            return []  
        log("debug","end")
        return [IsAuthenticated()]
    
    def get(self, request):
        output = []
        try:
            log("debug","start")
            user = None
            if request.user.is_authenticated:
                user = request.user
                isAdmin = user.is_superuser
            else:
                isAdmin = False  # treats anonymous as non-admin
            aprint(f"user: {user}, isAdmin: {isAdmin}")
            req_obj = request.GET.dict()
            loadMore = req_obj.get("loadMore",False)
            sort_order = int(req_obj.get("sortOrder","-1"))
            start_index = int(req_obj.get("st","0"))
            if sort_order not in [1,-1]:
                STATUS_CODE = 400
                log("info",f"Invalid sort order, sort_order: {sort_order}, STATUS_CODE: {STATUS_CODE}")
                return Response({"message":"Invalid sort order"},status=STATUS_CODE)
            aprint(f"req_obj: {req_obj}")
            try:
                loadMore = json.loads(loadMore.lower()) #imp converting string to boolean
            except Exception as exp:
                log("error",f"loadMore typecast exception: {str(e)}")
                aprint(exp)
            curr_offset = 0 
            if loadMore:
                curr_offset = start_index + CARDS_PER_PAGE
            else:
                start_index = 0
            #time.sleep(0.5)
            STATUS_CODE = 200
            min_date = datetime(2019,1,1)
            max_date = datetime.now()
            search_query = {"card_from_date": {
                                    "$gte": min_date,
                                    "$lte": max_date
                                }                       
                    }
            if isAdmin:
                search_query = {}                
            all_documents = self.collection.find(search_query).sort([("card_from_date", int(sort_order)), ("_id", int(sort_order))])
            total_doc_count = all_documents.count()            
            all_documents = all_documents.skip(curr_offset).limit(CARDS_PER_PAGE)
            cursor_slice_count = all_documents.count(with_limit_and_skip=True)
            aprint(f"cursor_slice_count : {cursor_slice_count}")
            hasMore =  (curr_offset+cursor_slice_count)< total_doc_count
            aprint(f"curr_offset: {curr_offset}")
            if total_doc_count<1:
                STATUS_CODE=411
                log("info","No records found, total_doc_count: {total_doc_count}")
                output.append({"message":"No records found"})
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
                    "card_img_url": img_url,
                    "card_from_date": doc.get("card_from_date","2001-11-22"),
                })
            output.append({"hasMore":hasMore})
            output.append({"curr_offset": curr_offset})
            log("debug","end")
        except Exception as e:
            STATUS_CODE = 500
            log("error",f"ReactView.get() {str(e)}")
            aprint(e)
        return Response(output,status=STATUS_CODE)
        
    def __random_id(self,size=5):
        id = "".join([str(random.randint(1,9)) for _ in range(5)])
        return id
    
    def post(self, request):
        self.db_obj.start_session()
        response = None
        aprint(f"ReactView.post() request.data: {request.data}")
        try:
            log("debug","start")
            # self.db_obj.start_transaction()
            isCopyMode = request.data.get("isCopyMode",False)
            aprint(f"from copy: {request.data} is copy mode: {isCopyMode}")
            img_id = request.data.get("card_img_id","")
            card_from_date = request.data.get("card_from_date","")
            if card_from_date == "":
                request.data["card_from_date"] = datetime.now()
            new_img_id = None
            if isCopyMode and img_id!="":
                try:
                    existing_img_file = self.gfs.get(ObjectId(img_id))
                    img_bin_data = existing_img_file.read()
                    base_file_name,img_extension  = existing_img_file.filename.split(".")
                    random_id = self.__random_id()
                    new_image_name = f"{base_file_name}_{random_id}.{img_extension}"
                    aprint(f"new_image_name: {new_image_name}")
                    compressed_img = self.img_util.compress_image(img_bin_data,isBin=1)
                    if compressed_img:
                        new_img_id = self.gfs.put(
                            compressed_img,
                            filename=new_image_name,
                            contentType=existing_img_file.content_type,
                            metadata=existing_img_file.metadata)
                        request.data["card_img_id"] = str(new_img_id)
                        del request.data["isCopyMode"]
                    aprint(f"After del isCopyMode",request.data)
                except Exception as ex:
                    # self.db_obj.rollback_transaction()
                    response = Response({"message": "Cannot create copy"})
                    log("error",f"Copy mode image save : {str(e)}")
                    aprint(ex)
            serializer = ReactSerializer(data=request.data)
            if serializer.is_valid(raise_exception = True):
                serializer_obj = serializer.save()
                inserted_form_id = serializer_obj.id or serializer_obj.pk
                self.__insert_tag_helper(inserted_form_id,request.data.get("card_tags",[]))
                response = Response(serializer.data)
                # self.db_obj.commit_transaction()
            log("debug","end")
        except Exception as exp:
            aprint(exp)
            log("error",f"error in saving post: {str(e)}")
            if new_img_id:
                try:
                    self.gfs.delete(new_img_id)
                    aprint(f"Rolled back GridFS file: {new_img_id}")
                    log("error",f"Rolled back image saved because post save was unsuccessful")
                except Exception as cleanup_err:
                    aprint(f"WARNING: failed to cleanup GridFS file {new_img_id}: {cleanup_err}")
                    log("error",f"Error in image rollback: {str(cleanup_err)}")
            response = Response({"message": "Transaction failed"}, status=500)
        finally:
            self.db_obj.end_session()
        return response
        
    def delete(self,request):
        try:
            log("debug","start")
            post_id = request.data.get("card_id",None)
            img_id = request.data.get("img_id",None)
            existing_record = None
            aprint(f"ReactView.delete() request.data: {request.data}")
            if img_id:
                isImageDeleted = self.gfs.delete(ObjectId(img_id))
                aprint(f"{img_id, isImageDeleted}")
                if isImageDeleted is None:
                    existing_record = self.collection.delete_one({"_id": ObjectId(post_id)})
                    aprint(f"{existing_record}")
            else:
                existing_record = self.collection.delete_one({"_id": ObjectId(post_id)})
            aprint(f'deleted: {request.data.get("card_tags",[])}')
            self.__delete_tag_helper(post_id,request.data.get("card_tags",[]))
            log("debug","end")
            return Response({"message": f"data deleted from server-> {existing_record!=None}"})
        except Exception as ex:
            log("error",f"{str(ex)}")
            aprint(ex)
            return Response({"message": "error occurred"})
            
    def patch(self,request,form_doc_id=None):
        aprint(f"Form Data>> {request.data}, form_id>> {form_doc_id}\n")
        response_obj = {"message":"","status":200}
        try:
            log("debug","start")
            existing_record = self.collection.find_one({"_id": ObjectId(form_doc_id)})
            if existing_record:                
                aprint(f"DB>> {existing_record}\n")
                update_fields = {}
                update_fields["card_title"] = request.data.get("title","")
                update_fields["card_desc"] = request.data.get("desc","")
                update_fields["card_git_link"] = request.data.get("github_url","")
                update_fields["card_from_date"]= datetime.strptime(request.data.get("from_date",""),"%Y-%m-%d")
                tags = request.data.get("tags", "")
                tags_from_request = None
                if isinstance(tags, str) and tags.strip():
                    tags_from_request =  re.split(r'\s*,\s*', tags)
                    update_fields["card_tags"] = tags_from_request
                elif isinstance(tags, list):
                    tags_from_request = [tag for tag in tags if tag.strip()] or ["untagged"]
                    update_fields["card_tags"] = tags_from_request
                else:
                    tags_from_request = ["untagged"]
                    update_fields["card_tags"] = tags_from_request
                 
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
                    
                aprint(f"modified fields>> {update_fields}")
                result = self.collection.update_one(
                            {"_id": ObjectId(form_doc_id)},
                            {"$set": update_fields}
                        )
                if result.modified_count > 0:
                    aprint("Record updated successfully")
                    response_obj["message"] = "Record updated successfully"
                    response_obj["status"] = 200
                else:
                    aprint("No changes made to the record")
                    response_obj["message"] = "No changes made to the record"
                    response_obj["status"] = 200
                    
                #handle tags edit function
                tags_from_request_set = set(tags_from_request)
                tags_from_db_set = set(existing_record.get("card_tags",[]))
                tags_to_be_inserted = list(tags_from_request_set.difference(tags_from_db_set))
                tags_to_deleted = list(tags_from_db_set.difference(tags_from_request_set))
                aprint(f"tag inserted:{tags_to_be_inserted}\ntags deleted:{tags_to_deleted}")
                if tags_to_be_inserted:
                    self.__insert_tag_helper(form_doc_id,tags_to_be_inserted)
                if tags_to_deleted:
                    self.__delete_tag_helper(form_doc_id,tags_to_deleted)
            else:
                response_obj["message"] = "Record"
                response_obj["status"] = 404
            log("debug","end")
        except Exception as e:
            aprint(e)
            log("error",f"ReactView.patch() {str(e)}")
            response_obj["message"] = "Internal server error"
            response_obj["status"] = 500
        return Response(response_obj,status=response_obj.get("status"))
    
    def __insert_tag_helper(self,form_id,tags):
        try:
            log("debug","start")
            # insert into tags collection
            bulk_upsert_query = []
            for tag_name in tags:
                bulk_upsert_query.append(
                    UpdateOne(
                        {"tag_name":tag_name},
                        {
                            "$set" : {
                                "modified_date": datetime.now()
                            },
                            "$addToSet": {
                                "cards_linked" : ObjectId(form_id)
                            }
                        },
                        upsert=True
                    )
                )
            # print(bulk_upsert_query)
            self.tag_collection.bulk_write(bulk_upsert_query)
            log("debug","end")
        except Exception as e:
            log("error",f"ReactView.__insert_tag_helper(): {str(e)}")
            aprint(e)
        
    def __delete_tag_helper(self,post_id,tag_names):
        try:
            log("debug","start")
            for tag_name in tag_names:
                #delete from cards_linked array
                self.tag_collection.update_one({"tag_name":tag_name},{"$pull": {"cards_linked": ObjectId(post_id)}})
                #delete the tag name if length is zero
                self.tag_collection.delete_one({"cards_linked": {"$size": 0}})
            log("debug","end")
        except Exception as e:
            log("error",f"ReactView.__delete_tag_helper(): {str(e)}")
            aprint(e)
      
class RealTimeSearchView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    tags_collection = db_obj.get_collection(collection_name="TAGS_TABLE")
    gfs = db_obj.get_grid_fs()
    authentication_classes = [CookieJWTAuthentication]
    def get_permissions(self):
        log("debug","start")
        if self.request.method == 'GET':
            log("debug","end")
            return []  
        log("debug","end")
        return [IsAuthenticated()]
    
    def _create_response(self,results,hasMore,curr_offset=0):
        try:
            log("debug","start")
            if not results:
                log("info",f"results is None, no results found")
                return {"message":"No results found"}
            
            for item in results:
                item["_id"] = str(item["_id"])           
                item["card_img_url"] = f'{os.getenv("HOST_NAME")}/api/image/fetch/{item.get("card_img_id","")}/'
            results.append({"hasMore":hasMore})
            results.append({"curr_offset": curr_offset})
            # print(results)
            log("info",f"results length: {len(results)}")
            log("info",f"results length without hasMore and curr_offset: {len(results)-2}")
            log("debug","end")
        except Exception as e:
            log("error",f"ReactView.__insert_tag_helper(): {str(e)}")
            aprint(e)
        return results
    
    def get(self,request):            
        STATUS_CODE = 200
        result_cursor = None
        results = None
        curr_offset = 0
        hasMore = False
        try:
            log("debug","start")
            aprint(f"RealTimeSearchView.get() request.GET: {request.GET}")
            query = request.GET.get('q', '')
            sort_order = int(request.GET.get('sort',-1))
            start_index = int(request.GET.get('st',0))
            loadMore = request.GET.get('loadMore',False)
            loadMore = json.loads(loadMore.lower()) #imp converting string to boolean
            if sort_order not in [1,-1]:
                STATUS_CODE = 400
                return Response({"message":"Invalid sort order"},status=STATUS_CODE)
            aprint(f"Sort order: {sort_order}")
            results = []
            min_date = datetime(2019,1,1)
            max_date = datetime.now()
            date_range = {"card_from_date": {
                                    "$gte": min_date,
                                    "$lte": max_date
                                }                       
                    }
            search_text = {
                    "card_title" : {
                    "$regex": query,
                    "$options" : "i"
                    }
            }
            curr_offset = 0 
            if loadMore:
                curr_offset = start_index + CARDS_PER_PAGE
            else:
                start_index = 0
            search_query = {
                "$and" : [search_text, date_range]
                
            }
            if sort_order:
                results_cursor = self.collection.find(search_query).sort([("card_from_date", int(sort_order)), ("_id", int(sort_order))]).skip(curr_offset).limit(CARDS_PER_PAGE)
            else:
                if not query:
                    return Response([],status=404)
                results_cursor = self.collection.find(search_query).skip(curr_offset).limit(CARDS_PER_PAGE)
            if not results_cursor:
                STATUS_CODE=404
            aprint(f"Search Query: {search_query}")
            projects_doc_count = results_cursor.count()
            cursor_slice_count = results_cursor.count(with_limit_and_skip=True)
            aprint(f"each slide: {cursor_slice_count}, count: {projects_doc_count}")
            hasMore =  (curr_offset+cursor_slice_count)<projects_doc_count
            results = list(results_cursor)
            #time.sleep(0.5)
            aprint(f"curr offset: {curr_offset}, hasMore: {hasMore}")
            log("debug","end")
        except Exception as e:
            STATUS_CODE = 500
            log("error",f"RealTimeSearchView.get() {str(e)}")
            aprint(e)
        return Response(self._create_response(results,hasMore,curr_offset),status=STATUS_CODE)
    
    def post(self,request):
        STATUS_CODE = 200
        results = []
        final_search_query = {}
        sort_order = -1
        try:
            log("debug","start")
            aprint(f"RTSV.post() request.data: {request.data}")
            search_req = request.data
            start_index = int(search_req.get("st","0"))
            loadMore = search_req.get("loadMore",False)
            if not search_req:
                return Response([])
            if True or not request.data.get("loadMore",False): #condition will be removed
                search_text = request.data.get("search_text","")
                search_tags = request.data.get("tags",[])
                filter_obj = request.data.get("filter",{})
                from_date =  request.data.get("date_range",{}).get("from","")
                to_date =  request.data.get("date_range",{}).get("to","")
                try:
                    min_date = datetime(2019,1,1)
                    # max_date = datetime.now()
                    max_date = datetime(2100,1,1)
                    # skip date range validation
                    # from_date = max(datetime.fromisoformat(from_date),min_date) if from_date else min_date
                    
                    # to_date = min(datetime.fromisoformat(to_date),max_date) if to_date else max_date
                    from_date = datetime.fromisoformat(from_date)
                    to_date = datetime.fromisoformat(to_date)
                except Exception as e:
                    STATUS_CODE = 400
                    log("error",f"RTSV.post(): {str(e)}")
                    aprint(e)
                    return
                    
                
                sort_order = request.data.get("sort",1)
                # print(f"from_date: {from_date} to_date: {to_date}")
                
                filter_flags = [False,False]
                all_filter = {}
                title_filter = {}
                desc_filter = {}
                text_filter = {}
                if not filter_obj:
                    text_filter = {}
                if filter_obj.get("title_chk",False):            
                    title_filter = {"card_title" :
                                        {"$regex":search_text,
                                        "$options": "i"}
                                }
                    filter_flags[0] = True
                    text_filter = title_filter
                    
                if filter_obj.get("desc_chk",False):            
                    desc_filter = {"card_desc" :
                                        {"$regex":search_text,
                                        "$options": "i"}
                            }
                    filter_flags[1] = True
                    text_filter = desc_filter
                
                if all(filter_flags):            
                    all_filter = {
                        "$or" : [
                            title_filter,
                            desc_filter
                        ]
                    }
                    text_filter = all_filter
                if search_text=="":
                    text_filter = {}
                    
                search_obj = {
                    "$and": [{
                        "card_from_date": {
                            "$gte": from_date,
                            "$lte": to_date
                        }}, 
                        text_filter]
                }
                projection = {"_id":1}
                aprint(search_obj)
                date_results = self.collection.find(search_obj,projection)
                date_results_form_ids = {str(item["_id"]): True for item in date_results}
                # print(f"date_results: {date_results_form_ids}")
                
                tag_results_form_ids = set()
                final_form_ids = []
                if search_tags:
                    search_tags = [each_tag.split()[0] for each_tag in search_tags]
                    tag_results_temp = list(self.tags_collection.find({"tag_name": {"$in": search_tags}},{"_id": 0, "cards_linked": 1}))
                    for item in tag_results_temp:
                        for form_id in item["cards_linked"]:
                            tag_results_form_ids.add(str(form_id))
                    final_form_ids = [ ObjectId(form_id) for form_id in date_results_form_ids.keys() if form_id in tag_results_form_ids]
                    # print(f"Tag results: {tag_results_form_ids}")
                else:
                    final_form_ids = [ObjectId(form_id) for form_id in date_results_form_ids.keys()]
                
                final_search_query = {
                    "_id": {
                        "$in" : final_form_ids
                    }
                }
            
            
            curr_offset = 0 
            if loadMore:
                curr_offset = start_index + CARDS_PER_PAGE
            else:
                start_index = 0
            #time.sleep(0.5)
            results_cursor = self.collection.find(final_search_query).sort([("card_from_date", int(sort_order)), ("_id", int(sort_order))])
            
            total_results_count = results_cursor.count()
            
            results_cursor = results_cursor.skip(curr_offset).limit(CARDS_PER_PAGE)
            
            results = list(results_cursor)
            # print(results)
            cursor_slice_count = results_cursor.count(with_limit_and_skip=True)
            aprint(cursor_slice_count)
            hasMore =  (curr_offset+cursor_slice_count)<total_results_count
            aprint(f"curr_offset: {curr_offset} hasMoreSearch: {hasMore}")
            
            if not results or len(results)==0:
                STATUS_CODE = 404
            log("debug","end")
        except Exception as e:
            results = []
            log("error",f"RTSV.post(): {str(e)}")
            aprint(e)
            STATUS_CODE = 500
        finally:
            return Response(self._create_response(results,hasMore,curr_offset),status=STATUS_CODE)
            
class ImageUploadView(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection()
    gfs = db_obj.get_grid_fs()
    img_util = ImageUtilities()
    flag = True
    authentication_classes = [CookieJWTAuthentication]
    def get_permissions(self):
        log("debug","start")
        if self.request.method == 'GET':
            log("debug","end")
            return []  
        log("debug","end")
        return [IsAuthenticated()]
    
    def get(self, request, image_id):
        try:
            log("debug","start")
            file = self.gfs.get(ObjectId(image_id))
            response = HttpResponse(file.read(), content_type=file.content_type)
            response['Content-Disposition'] = f'inline; filename="{file.filename}"'
            log("debug","end")
            return response
        except Exception as e:
            log("error",f"IUV.get(): {str(e)}")
            aprint(e)
            return HttpResponse("Image not found", status=404)
    
    def post(self,request):
        STATUS_CODE=200        
        try:
            log("debug","start")
            image_file = request.FILES.get("imageFile")     
            if not image_file:
                return Response({"error": "Image file is required"}, status=400)
            compressed_img = self.img_util.compress_image(image_file)
            file_id = self.gfs.put(compressed_img, filename=image_file.name, content_type="image/jpeg")
            res = {"_id" : str(file_id)}
            log("debug","end")
        except Exception as e:
            STATUS_CODE=500
            log("error",f"IUV.post(): {str(e)}")
            aprint(e)
        
        return Response(res,status=STATUS_CODE)
    
class GetTags(APIView):
    db_obj = DBConnect()
    collection = db_obj.get_collection(collection_name="TAGS_TABLE")
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        results = None
        try:
            log("debug","start")
            db_results = list(self.collection.find({},{"tag_name": 1,"cards_linked":1,"_id":0}))
            results = {f'{obj["tag_name"]} x{len(obj["cards_linked"])}': True for obj in db_results}
            log("debug","end")
        except Exception as e:
            log("error",f"GetTags.get(): {str(e)}")
            aprint(e)
        return Response(results.keys())
    
class LogoutView(APIView):
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):
        try:
            log("debug","start")
            response = Response({"message": "Logged out"})
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            log("debug","end")
        except Exception as e:
            log("error",f"LogoutView.post(): {str(e)}")
            aprint(e)
        return response

class LoginView(APIView):
    def post(self, request):
        try:
            log("debug","start")
            username = request.data.get("username")
            password = request.data.get("password")
            user = authenticate(username=username, password=password)
            log("info",f"user: {user}")
            if user:
                log("info",f"user: {user} found user")
                refresh = RefreshToken.for_user(user)
                response = Response({"message": "Login successful"})
                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=True if os.getenv('IS_PROD')=='True' else False,      
                    samesite='None' if os.getenv('IS_PROD')=='True' else 'Strict', 
                    path="/",    
                )
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=True if os.getenv('IS_PROD')=='True' else False,      
                    samesite='None' if os.getenv('IS_PROD')=='True' else 'Strict', 
                )
                return response
            log("info","user not found")
            log("debug","end")
        except Exception as e:
            log("error",f"LoginView.post(): {str(e)}")
            aprint(e)
        return Response({"error": "Invalid credentials1"}, status=401)
    
class CheckAuthView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        log("debug","CheckAuthView start/end")
        return Response({"message": "Authenticated"})
