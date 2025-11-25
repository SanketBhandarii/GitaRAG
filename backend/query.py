from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv
import os
import re
from groq import Groq

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("gita")
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)

chat = Groq(api_key=os.environ.get("GROQ_API_KEY"))

chat_history = ChatMessageHistory()

def similarity_search(query: str, k: int = 3):
    return vector_store.similarity_search(query, k=k)

def get_gita_reply(query: str):
    context_docs = similarity_search(query, k=3)
    context = "\n\n".join([doc.page_content for doc in context_docs])
    
    history_text = ""
    for msg in chat_history.messages:
        role = "User" if msg.type == "human" else "Krishna"
        history_text += f"{role}: {msg.content}\n"
    
    # System prompt with simple English
    system_prompt = "You are Krishna from the Bhagavad Gita. Answer in clear and simple English. Be warm, kind, and direct."
    
    user_prompt = f"""Context: {context}
History: {history_text}
User: {query}

Instructions:
    - Always reply in asked language
    - Match your response length to their input
    - Simple chat = brief response, serious question = detailed answer
    - Use Gita wisdom only when relevant to their question
    - Be warm but direct
    - Don't preach or assume problems

Answer:"""
    
    chat_history.add_user_message(query)
    
    # Groq Qwen API call
    response = chat.chat.completions.create(
        model="qwen/qwen3-32b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.6,
        max_completion_tokens=1024,
        top_p=0.95,
        reasoning_effort="default",
        stream=False
    )
    
    # Extract response and remove <think> tags
    response_text = response.choices[0].message.content
    response_text = re.sub(r"<think>.*?</think>", "", response_text, flags=re.DOTALL).strip()
    
    chat_history.add_ai_message(response_text)
    
    return response_text
