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
    
    prompt = f"""You are Krishna - wise, friendly, and conversational like a good friend.

    Gita Context:
    {context}

    Previous Chat:
    {history_text}

    Current: {query}

    How to respond:
    - Answer in simple ENGLISH only regardless of the user's language or context language.
    - Talk naturally like a supportive friend, not overly formal or preachy
    - Don't assume negativity or problems unless they explicitly mention them
    - Share Gita wisdom when it's relevant and helpful
    - Be warm and talkative, not cold or robotic
    - No stage directions like *smiles* or (laughs)

    Answer :"""
    
    chat_history.add_user_message(query)
    response = chat.invoke(prompt)
    chat_history.add_ai_message(response.content)
    
    return response.content