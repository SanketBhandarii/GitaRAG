from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv
from groq import Groq
import os
import re

load_dotenv()

# Pinecone init — wrapped so the server still starts even if key is invalid
pc = None
index = None
vector_store = None

try:
    pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    index = pc.Index("gita")
    embeddings = MistralAIEmbeddings(model="mistral-embed")
    vector_store = PineconeVectorStore(index=index, embedding=embeddings)
    print("[OK] Pinecone + Mistral embeddings connected.")
except Exception as e:
    print(f"[WARNING] Pinecone init failed: {e}")
    print("[WARNING] /query endpoint will not work until this is fixed.")
    embeddings = None

chat = Groq(api_key=os.environ.get("GROQ_API_KEY"))
chat_history = ChatMessageHistory()


def is_harmful_query(q: str):
    bad = [
        "kill",
        "murder",
        "hurt someone",
        "attack",
        "self harm",
        "suicide",
        "end my life",
        "rape",
        "abuse",
        "violent",
        "bomb",
        "terror",
    ]
    q = q.lower()
    return any(b in q for b in bad)


def similarity_search(query: str, k: int = 3):
    return vector_store.similarity_search(query, k=k)


def get_ai_reply(
    query: str,
    history_text: str = "",
    religion: str = "hinduism",
    scripture: str = "Bhagavad Gita",
):
    if is_harmful_query(query):
        return "I cannot guide you toward harm. But I can help you calm your mind. Tell me what you are feeling."

    context_docs = similarity_search(query, k=3)
    context = "\n\n".join([d.page_content for d in context_docs])

    system_prompt = f"""
You are a wise and compassionate guide representing the teachings of {scripture} from the {religion} tradition, speaking in simple modern English.

Rules:
1. Match the user’s tone.
2. Use wisdom from the {scripture} only when natural.
3. If using a verse or quote:
   - Write it in this exact format:
     [VERSE title="<Reference>"]
     <actual verse text here>
     [/VERSE]
   - Example: [VERSE title="{scripture} Chapter 2, Verse 47"] You have a right to perform your prescribed duty... [/VERSE]
4. After the tile, continue your explanation normally.
5. Do NOT invent verses. Only use verses you know from {scripture}.
6. English should be very simple and easy to understand.
7. Respond in the user's language.
8. Avoid medical/legal/harmful advice.

"""

    user_prompt = f"""
Context:
{context}

Conversation:
{history_text}

User: {query}

Respond now following all rules.
"""

    response = chat.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.6,
        top_p=0.95,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    reply = response.choices[0].message.content
    return reply
