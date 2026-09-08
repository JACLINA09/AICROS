"""
Embedding + semantic similarity — the "Retrieval" half of RAG.

Course descriptions are embedded once (when created), and a search query is
embedded at request time. Comparing them with cosine similarity finds
conceptually related courses even when no exact keywords match.
"""

import os
import math
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
EMBEDDING_MODEL = "gemini-embedding-001"


def generate_embedding(text: str) -> list[float]:
    response = client.models.embed_content(model=EMBEDDING_MODEL, contents=text)
    return response.embeddings[0].values


def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)