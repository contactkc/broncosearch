import json
import os
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, PineconeException
from tqdm.auto import tqdm
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')

print("start loading sentence transformer model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("model loaded")

print("connecting to Pinecone...")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_HOST = os.getenv("PINECONE_HOST")

if not PINECONE_API_KEY or not PINECONE_HOST:
    print("API key or host not found, make sure your .env.local file is configured correctly")
    exit()

try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(host=PINECONE_HOST)
    index.describe_index_stats()
    print("connected to Pinecone successfully")
except PineconeException as e:
    print(f"failed to connect to Pinecone or findd index, recheck host URL and API key")
    print(f"error: {e}")
    exit()

print("loading course data from cpp_courses.json")
try:
    with open("backend/json/cpp_courses.json", "r") as f:
        courses = json.load(f)
except FileNotFoundError:
    print("cpp_courses.json not found, please run scraper.py first")
    exit()
print(f"loaded {len(courses)} courses")

batch_size = 128
print(f"starting to upsert {len(courses)} courses in batches of {batch_size}")

for i in tqdm(range(0, len(courses), batch_size)):
    i_end = min(i + batch_size, len(courses))
    batch = courses[i:i_end]

    texts_to_embed = [course['text_for_embedding'] for course in batch]
    embeddings = model.encode(texts_to_embed).tolist()

    to_upsert = []
    for course, embedding in zip(batch, embeddings):
        metadata = {
            "subject": course.get("subject", ""),
            "catalog_number": course.get("catalog_nbr", ""),
            "title": course.get("title", ""),
            "description": course.get("description", ""),
        }
        vector_id = f"{course.get('subject', '')}-{course.get('catalog_nbr', '')}"
        to_upsert.append((vector_id, embedding, metadata))

    index.upsert(vectors=to_upsert)

print("all courses have been upserted to pinecone successfully")