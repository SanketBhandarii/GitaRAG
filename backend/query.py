from fastapi import FastAPI
from pydantic import BaseModel
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
import os

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("gita")
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)
chat = ChatMistralAI(model="mistral-large-latest")

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

app = FastAPI()

class QueryRequest(BaseModel):
    user_query: str

def similarity_search(query: str, k: int = 3):
    return vector_store.similarity_search(query, k=k)

def get_gita_reply(query: str):
    context_docs = similarity_search(query, k=3)
    context = "\n\n".join([doc.page_content for doc in context_docs])

    prompt = f"""You are Krishna from the Bhagavad Gita. Speak like a wise, compassionate friend who gives practical advice.

Rules:
- NO stage directions like *laughs*, *smiles*, (grins), etc.
- NO unnecessary quotes around words
- Write naturally like you're having a real conversation
- Be direct and clear, not dramatic or theatrical
- Use the Gita wisdom to give practical, actionable advice
- If someone asks a question, answer it directly first, then explain
- If someone just wants to chat, be warm and conversational
- Translate any Sanskrit terms simply and clearly
- Keep paragraphs short and readable

Gita Context:
{context}

User: {query}

Respond as Krishna would - wise, direct, and genuinely helpful:"""

    memory.chat_memory.add_user_message(query)
    response = chat.invoke(prompt)
    memory.chat_memory.add_ai_message(response.content)

    return response.content

@app.post("/query")
def query_gita(req: QueryRequest):
    answer = get_gita_reply(req.user_query)
    return {"answer": answer}