from typing import Optional, List
from pydantic import BaseModel
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import Optional, List, Annotated
from datetime import datetime
from enum import Enum

# Helper for MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]


class CategoryEnum(str, Enum):
    ALL = "All"
    STORY = "Story"
    POST = "Post"
    REELS = "Reels"
    LOGO = "Logo"
    BANNER = "Banner"
    OTHER = "Other"


class PromptBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    prompt_text: str = Field(..., min_length=10)
    image_url: Optional[str] = None
    category: CategoryEnum = CategoryEnum.OTHER
    tags: List[str] = []
    author: str = Field(..., description="Name of the creator")


class PromptCreate(PromptBase):
    pass


class PromptUpdate(BaseModel):
    title: Optional[str] = None
    prompt_text: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[CategoryEnum] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    is_approved: Optional[bool] = None


class PromptDB(PromptBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    is_approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={datetime: lambda dt: dt.isoformat()}
    )


class Token(BaseModel):
    access_token: str
    token_type: str


class Prompt(BaseModel):
    title: str
    prompt_text: str
    category: str
    tags: List[str] = []
    author: str
    image_url: Optional[str] = None  # <--- این خط باید باشد
