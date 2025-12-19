import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# در محیط پروداکشن حتما از Environment Variables استفاده کنید
# اگر با داکر اجرا می‌کنید، نام هاست باید اسم سرویس دیتابیس در docker-compose باشد (مثلا mongodb)
MONGO_URL = os.getenv(
    "MONGO_URL", "mongodb://my_main_user_1213saa:hwWFgqr3dfq34qefrgeq@mongodb:27017")
DB_NAME = "prompt_center"


class Database:
    client: AsyncIOMotorClient = None
    db = None


db = Database()


async def connect_to_mongo():
    """اتصال به دیتابیس را برقرار می‌کند (باید در startup صدا زده شود)"""
    try:
        db.client = AsyncIOMotorClient(MONGO_URL)
        db.db = db.client[DB_NAME]
        # تست اتصال
        await db.client.server_info()
        print(f"✅ Connected to MongoDB at {MONGO_URL}")
    except Exception as e:
        print(f"❌ Could not connect to MongoDB: {e}")


async def close_mongo_connection():
    """اتصال را قطع می‌کند"""
    if db.client:
        db.client.close()
        print("MongoDB connection closed")

# --- Helper Function ---


def prompt_helper(prompt) -> dict:
    """تبدیل آبجکت مونگو به دیکشنری پایتون و تبدیل _id به رشته"""
    return {
        "_id": str(prompt["_id"]),
        "title": prompt.get("title"),
        "prompt_text": prompt.get("prompt_text"),
        "category": prompt.get("category"),
        "tags": prompt.get("tags", []),
        "author": prompt.get("author"),
        "image_url": prompt.get("image_url"),  # اگر فیلد عکس دارید
    }

# --- CRUD Operations ---


async def fetch_all_prompts(category: str = None, tags: list = None):
    query = {}

    # فیلتر بر اساس دسته‌بندی
    if category and category != "All":
        query["category"] = category

    # فیلتر بر اساس تگ‌ها (اگر لیستی از تگ‌ها ارسال شود)
    if tags:
        # یا $all اگر می‌خواهید شامل همه تگ‌ها باشد
        query["tags"] = {"$in": tags}

    prompts = []
    cursor = db.db.prompts.find(query)

    async for document in cursor:
        prompts.append(prompt_helper(document))
    return prompts


async def create_prompt(prompt_data: dict) -> dict:
    prompt = await db.db.prompts.insert_one(prompt_data)
    new_prompt = await db.db.prompts.find_one({"_id": prompt.inserted_id})
    return prompt_helper(new_prompt)


async def fetch_all_tags():
    # گرفتن تمام تگ‌های یکتا از کل داکیومنت‌ها
    tags = await db.db.prompts.distinct("tags")
    return tags
