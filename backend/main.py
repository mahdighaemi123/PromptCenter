from fastapi.middleware.cors import CORSMiddleware  # <--- این خط را اضافه کنید
from fastapi import FastAPI, HTTPException, status, Depends, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List, Optional
from bson import ObjectId
from datetime import timedelta
from jose import JWTError, jwt
import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles # <--- اضافه کردن این
from fastapi.middleware.cors import CORSMiddleware
from database import fetch_all_prompts, create_prompt, fetch_all_tags
from models import Prompt

from models import PromptDB, PromptCreate, PromptUpdate, CategoryEnum, Token, PyObjectId
from database import db, MONGO_URL, DB_NAME
import datetime


# --- Config & Auth Settings ---
SECRET_KEY = "efWTE4TOP,4TU2MZRWPDJEIDHVWJ"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# --- Lifecycle Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.client = AsyncIOMotorClient(MONGO_URL)
    db.db = db.client[DB_NAME]
    print("✅ Connected to MongoDB (Async)")
    yield
    # Shutdown
    db.client.close()
    print("🛑 Disconnected from MongoDB")

app = FastAPI(lifespan=lifespan, title="Prompt Center API")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# --- این تنظیمات را حتماً اضافه کنید ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # یا ["http://localhost:5173"] برای امنیت بیشتر
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != "admin":
            raise HTTPException(status_code=401, detail="Not authorized")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    return username

# --- Routes ---

# 1. Login


@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Hardcoded admin for simplicity as requested
    if form_data.username == "admin" and form_data.password == "admin":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=400, detail="Incorrect username or password")

# 2. Get Prompts (Public)


@app.get("/prompts", response_model=List[PromptDB])
async def get_prompts(
    category: Optional[CategoryEnum] = None,
    tags: Optional[List[str]] = Query(None),
    limit: int = 50
):
    query = {"is_approved": True}

    if category and category != CategoryEnum.ALL:
        query["category"] = category

    if tags:
        query["tags"] = {"$all": tags}

    # Async cursor
    cursor = db.db.prompts.find(query).sort("created_at", -1).limit(limit)
    prompts = await cursor.to_list(length=limit)
    return prompts

# 3. Submit Prompt (Public & Admin)


@app.post("/prompts", response_model=PromptDB, status_code=status.HTTP_201_CREATED)
async def create_prompt(prompt: PromptCreate):
    """
    User submission. By default is_approved=False.
    Frontend logic: If user is logged in as Admin, they should hit a different flow 
    or we handle it here if we pass a token. For simplicity, all POSTs here are user submissions.
    """
    new_prompt = PromptDB(**prompt.model_dump(), is_approved=False)

    # Validation: Ensure Author is present
    if not new_prompt.author or new_prompt.author.strip() == "":
        raise HTTPException(status_code=400, detail="Author name is required")

    result = await db.db.prompts.insert_one(new_prompt.model_dump(by_alias=True, exclude=["id"]))
    created_prompt = await db.db.prompts.find_one({"_id": result.inserted_id})
    return created_prompt

# 4. Get Unique Tags (For Filter UI)


@app.get("/tags", response_model=List[str])
async def get_tags():
    """
    Returns a list of all unique tags used in APPROVED prompts.
    """
    pipeline = [
        {"$match": {"is_approved": True}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags"}},
        {"$sort": {"_id": 1}}
    ]
    cursor = db.db.prompts.aggregate(pipeline)
    tags = [doc["_id"] async for doc in cursor]
    return tags

# 5. Admin: Dashboard List (Include unapproved)


@app.get("/admin/prompts", response_model=List[PromptDB])
async def get_admin_prompts(current_user: str = Depends(get_current_admin)):
    cursor = db.db.prompts.find().sort("created_at", -1)
    return await cursor.to_list(length=100)

# 6. Admin: Create Direct (Auto-approve & Default Author)


@app.post("/admin/prompts", response_model=PromptDB)
async def create_admin_prompt(
    prompt: PromptCreate,
    current_user: str = Depends(get_current_admin)
):
    data = prompt.model_dump()
    # Logic: Default author if empty
    if not data.get("author"):
        data["author"] = "Prompt Center"

    new_prompt = PromptDB(**data, is_approved=True)
    result = await db.db.prompts.insert_one(new_prompt.model_dump(by_alias=True, exclude=["id"]))
    return await db.db.prompts.find_one({"_id": result.inserted_id})

# 7. Admin: Update Prompt


@app.put("/admin/prompts/{id}", response_model=PromptDB)
async def update_prompt(id: str, update_data: PromptUpdate, current_user: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    # Remove None values
    update_dict = {k: v for k, v in update_data.model_dump().items()
                   if v is not None}

    if len(update_dict) >= 1:
        update_result = await db.db.prompts.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_dict}
        )
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Prompt not found")

    if (existing_prompt := await db.db.prompts.find_one({"_id": ObjectId(id)})) is not None:
        return existing_prompt

    raise HTTPException(status_code=404, detail="Prompt not found")

# 8. Admin: Delete Prompt


@app.delete("/admin/prompts/{id}")
async def delete_prompt(id: str, current_user: str = Depends(get_current_admin)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    delete_result = await db.db.prompts.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Prompt deleted"}

    raise HTTPException(status_code=404, detail="Prompt not found")

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # ساخت اسم یکتا برای فایل که تکراری نشود
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{unique_filename}"

    # ذخیره فایل روی سیستم
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # برگرداندن آدرس کامل عکس
    # اگر روی سرور واقعی رفتید، localhost را با آدرس سایت عوض کنید
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}