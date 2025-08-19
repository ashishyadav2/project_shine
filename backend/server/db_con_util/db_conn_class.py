from pymongo import MongoClient
import gridfs
from gridfs import GridFSBucket
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
        self.session = None
        self.grid_bucket = GridFSBucket(self.db)
        
    def get_collection(self,collection_name: str = None): 
        if collection_name is None:
            collection_name = os.getenv("DB_TABLE")
        self.collection = self.db[collection_name]
        return self.collection
    
    def get_grid_fs(self):
        return self.grid_fs
    
    def get_grid_bucket(self):
        return self.grid_bucket
    
    def get_db_conn(self):
        return self.db
    
    def start_session(self):
        self.session = self.client.start_session()
        
    def end_session(self):
        self.session.end_session()
        
    def start_transaction(self):
        self.session.start_transaction()
        
    def rollback_transaction(self):
        self.session.abort_transaction()
        
    def commit_transaction(self):
        self.session.commit_transaction()