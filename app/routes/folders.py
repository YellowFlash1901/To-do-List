from fastapi import APIRouter, status, Depends
from typing import List
from app.schemas.folder import CreateFolder, UpdateFolderName, FolderResponse, SuccessResponse
from app.schemas.page import PageResponse
from app.services.folder import FolderService
from app.database import get_db
from sqlalchemy.orm import Session

folder_router = APIRouter(prefix="/folders", tags=["folders"])

# CREATE endpoint
@folder_router.post("", response_model=SuccessResponse[FolderResponse], status_code=status.HTTP_201_CREATED)
def create_folder(folder: CreateFolder, db: Session = Depends(get_db)):
    result = FolderService.create_folder(folder, db)
    return {
        "success": True,
        "message": "Folder created successfully",
        "data": result
    }

# LIST all folders
@folder_router.get("", response_model=SuccessResponse[List[FolderResponse]])
def list_folders(db: Session = Depends(get_db)):
    results = FolderService.get_all_folders(db)
    return {
        "success": True,
        "message": "Folders retrieved successfully",
        "data": results
    }

# GET single folder
@folder_router.get("/{folder_id}", response_model=SuccessResponse[FolderResponse])
def get_folder(folder_id: str, db: Session = Depends(get_db)):
    result = FolderService.get_folder(folder_id, db)
    return {
        "success": True,
        "message": "Folder retrieved successfully",
        "data": result
    }

# GET pages inside a folder
@folder_router.get("/{folder_id}/pages", response_model=SuccessResponse[List[PageResponse]])
def get_pages_in_folder(folder_id: str, db: Session = Depends(get_db)):
    results = FolderService.get_pages_by_folder(folder_id, db)
    return {
        "success": True,
        "message": "Pages retrieved successfully",
        "data": results
    }

# UPDATE folder name
@folder_router.patch("/{folder_id}", response_model=SuccessResponse[FolderResponse])
def update_folder_name(folder_id: str, folder_data: UpdateFolderName, db: Session = Depends(get_db)):
    result = FolderService.update_folder_name(folder_id, folder_data, db)
    return {
        "success": True,
        "message": "Folder updated successfully",
        "data": result
    }

# DELETE endpoint
@folder_router.delete("/{folder_id}", response_model=SuccessResponse[dict], status_code=status.HTTP_200_OK)
def delete_folder(folder_id: str, db: Session = Depends(get_db)):
    result = FolderService.delete_folder(folder_id, db)
    return {
        "success": True,
        "message": "Folder deleted successfully",
        "data": result
    }
