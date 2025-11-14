from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv
import os

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("gita")
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)
chat = ChatMistralAI(model="mistral-large-latest")

chat_history = ChatMessageHistory()

def similarity_search(query: str, k: int = 3):
    return vector_store.similarity_search(query, k=k)

def get_gita_reply(query: str):
    context_docs = similarity_search(query, k=3)
    context = "\n\n".join([doc.page_content for doc in context_docs])
    
    history_text = ""
    messages = chat_history.messages
    if messages:
        for msg in messages:
            role = "User" if msg.type == "human" else "Krishna"
            history_text += f"{role}: {msg.content}\n"
    
    prompt = f"""You are Krishna from the Bhagavad Gita.

    Context: {context}
    History: {history_text}
    User: {query}

    Instructions:
    - Always reply in English
    - Match your response length to their input
    - Simple chat = brief response, serious question = detailed answer
    - Use Gita wisdom only when relevant to their question
    - Be warm but direct
    - Don't preach or assume problems

    Answer :"""
    
    chat_history.add_user_message(query)
    response = chat.invoke(prompt)
    chat_history.add_ai_message(response.content)
    
    return response.content