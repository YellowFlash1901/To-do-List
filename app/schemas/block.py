from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')

class Blockbase(BaseModel):
    page_id: str
    type: str
    content: Optional[str] = None
    position: int


class CreateBlock(Blockbase):
    pass


class UpdateBlock(BaseModel):
    type: Optional[str] = None
    content: Optional[str] = None
    position: Optional[int] = None

class BlockResponse(BaseModel):
    page_id: str
    id :str
    type: str
    content: Optional[str] = None
    position: int 


class SuccessResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: T  # Can be PageResponse, List[PageResponse], dict, etc.