from pymongo import MongoClient
import gridfs
from dotenv import load_dotenv
import os
load_dotenv()

class DBConnect:
    def __init__(self):
        self.client = MongoClient(os.getenv("DB_URI")) 
        self.db = self.client[os.getenv("DB_NAME")]
        # self.collection = self.db[os.getenv("DB_TABLE")]
        self.collection = None
        self.grid_fs = gridfs.GridFS(self.db)
        
    def get_collection(self,collection_name: str = None): 
        if collection_name is None:
            collection_name = os.getenv("DB_TABLE")
        self.collection = self.db[collection_name]
        return self.collection
    
    def get_grid_fs(self):
        return self.grid_fs