from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from dotenv import load_dotenv
from uuid import uuid4
import os

load_dotenv()

# Check keys
print("Mistral API:", os.environ.get("MISTRAL_API_KEY"))
print("Pinecone API:", os.environ.get("PINECONE_API_KEY"))

# Load PDF
file_path = "./data/gita.pdf"
loader = PyPDFLoader(file_path)
documents = loader.load()


# Split into chunks

text_splitter = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=10, separators=["\n\n", "\n", " ", ""])
texts = text_splitter.split_documents(documents)
print(f"Total chunks: {len(texts)}")

# Initialize embeddings
embeddings = MistralAIEmbeddings(model="mistral-embed")

# Initialize Pinecone

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "gita"
index = pc.Index(index_name)

vector_store = PineconeVectorStore(embedding=embeddings, index=index)


# Upload chunks to Pinecone
# Generate UUIDs for each chunk
uuids = [str(uuid4()) for _ in range(len(texts))]

# This will use Mistral embeddings automatically
vector_store.add_documents(documents=texts, ids=uuids)

print("✅ All chunks + metadata + embeddings uploaded to Pinecone successfully!")
