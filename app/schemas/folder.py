from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List

T = TypeVar('T')

class Folderbase(BaseModel):
    id: str
    name: Optional[str] = None


class CreateFolder(BaseModel):
    name: Optional[str] = None

class UpdateFolderName(BaseModel):
    name: str

class FolderResponse(BaseModel):
    id: str
    name: str

class SuccessResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: T  # Can be PageResponse, List[PageResponse], dict, etc.