from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')

class Pagebase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class CreatePage(Pagebase):
    pass


class UpdatePage(Pagebase):
    pass    

class PageResponse(BaseModel):
    id: str
    title: Optional[str] = None
    content: Optional[str] = None

class SuccessResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: T  # Can be PageResponse, List[PageResponse], dict, etc.