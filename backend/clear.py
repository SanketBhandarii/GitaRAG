from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.environ.get("PINECONE_API_KEY")
print("Loaded API key:", api_key)

pc = Pinecone(api_key=api_key)

index_name = "gita"
index = pc.Index(index_name)

index.delete(delete_all=True)

print("🔥 All vectors deleted successfully!")
