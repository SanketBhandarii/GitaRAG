from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from dotenv import load_dotenv
from uuid import uuid4
import os
import glob
import sys
import codecs

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "gita"
index = pc.Index(index_name)
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(embedding=embeddings, index=index)

if sys.platform == "win32":
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def process_pdfs():
    pdf_files = glob.glob("./data/*.pdf")
    for file_path in pdf_files:
        try:
            namespace = os.path.splitext(os.path.basename(file_path))[0].lower()
            loader = PyPDFLoader(file_path)
            documents = loader.load()

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=100, separators=["\n\n", "\n", " ", ""]
            )
            texts = text_splitter.split_documents(documents)

            batch_size = 100
            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]
                batch_uuids = [str(uuid4()) for _ in range(len(batch))]
                vector_store.add_documents(
                    documents=batch, ids=batch_uuids, namespace=namespace
                )

        except Exception as e:
            print(f"[ERROR] Processing {file_path}: {e}")


if __name__ == "__main__":
    process_pdfs()
