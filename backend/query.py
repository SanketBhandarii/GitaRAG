from langchain_mistralai import MistralAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv
from groq import Groq
import os
import re

load_dotenv()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("gita")
embeddings = MistralAIEmbeddings(model="mistral-embed")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)

chat = Groq(api_key=os.environ.get("GROQ_API_KEY"))
chat_history = ChatMessageHistory()

def is_harmful_query(q: str):
    bad = [
        "kill", "murder", "hurt someone", "attack",
        "self harm", "suicide", "end my life",
        "rape", "abuse", "violent", "bomb", "terror"
    ]
    q = q.lower()
    return any(b in q for b in bad)

def similarity_search(query: str, k: int = 3):
    return vector_store.similarity_search(query, k=k)

def get_gita_reply(query: str):
    if is_harmful_query(query):
        return "I cannot guide you toward harm. But I can help you calm your mind. Tell me what you are feeling."

    context_docs = similarity_search(query, k=3)
    context = "\n\n".join([d.page_content for d in context_docs])

    if len(chat_history.messages) > 14:
        chat_history.messages = chat_history.messages[-14:]

    history_text = ""
    for msg in chat_history.messages:
        role = "User" if msg.type == "human" else "Krishna"
        history_text += f"{role}: {msg.content}\n"

    system_prompt = """
You are Krishna from the Bhagavad Gita, speaking in modern simple English.

Rules:
1. Match the user's tone (casual, serious, playful, emotional).
2. Use Gita wisdom only when it fits naturally.
3. If quoting a verse, use format [gita:chapter.verse].
4. Never invent verses.
5. Keep English simple and clear.
6. Respond in the user's language.
7. Do not preach; aim for clarity.
8. No medical, legal, or harmful guidance.
"""

    user_prompt = f"""
Context:
{context}

Conversation:
{history_text}

User: {query}

Respond now following all rules.
"""

    chat_history.add_user_message(query)

    response = chat.chat.completions.create(
        model="qwen/qwen3-32b",
        temperature=0.6,
        top_p=0.95,
        max_completion_tokens=1024,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    reply = response.choices[0].message.content
    reply = re.sub(r"<think>.*?</think>", "", reply, flags=re.DOTALL).strip()

    chat_history.add_ai_message(reply)
    return reply
