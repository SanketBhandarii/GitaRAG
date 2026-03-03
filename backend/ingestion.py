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

# Check keys
print("Mistral API:", os.environ.get("MISTRAL_API_KEY"))
print("Pinecone API:", os.environ.get("PINECONE_API_KEY"))

# Initialize Pinecone
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "gita"  # Keeping your index name as requested
index = pc.Index(index_name)
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(embedding=embeddings, index=index)


# Ensure UTF-8 output for Windows console
if sys.platform == "win32":
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())


def process_pdfs():
    pdf_files = glob.glob("./data/*.pdf")
    print(f"Found {len(pdf_files)} PDF files: {pdf_files}")

    for file_path in pdf_files:
        try:
            # Extract namespace from filename (e.g., ./data/gita.pdf -> gita)
            namespace = os.path.splitext(os.path.basename(file_path))[0].lower()
            print(f"\n--- Processing {file_path} (Namespace: {namespace}) ---")

            # Load PDF
            loader = PyPDFLoader(file_path)
            documents = loader.load()

            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=100, separators=["\n\n", "\n", " ", ""]
            )
            texts = text_splitter.split_documents(documents)
            print(f"Total chunks: {len(texts)}")

            # Batch upload to avoid timeouts/500 errors
            batch_size = 100
            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]
                batch_uuids = [str(uuid4()) for _ in range(len(batch))]
                vector_store.add_documents(
                    documents=batch, ids=batch_uuids, namespace=namespace
                )
                print(f"Uploaded batch {i // batch_size + 1} for {namespace}")

            print(f"[SUCCESS] Ingested {namespace}")

        except Exception as e:
            print(f"[ERROR] Processing {file_path}: {e}")


if __name__ == "__main__":
    process_pdfs()
    print("\n[COMPLETE] All ingestions complete!")
