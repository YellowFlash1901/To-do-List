from fastapi import APIRouter, status, Depends
from typing import List
from app.schemas.page import CreatePage, UpdatePage, PageResponse, SuccessResponse
from app.services.page import PageService
from app.database import get_db
from sqlalchemy.orm import Session

page_router = APIRouter(prefix="/pages", tags=["pages"])

# CREATE endpoint
@page_router.post("", response_model=SuccessResponse[PageResponse], status_code=status.HTTP_201_CREATED)
def create_page(page: CreatePage, db: Session = Depends(get_db)):
    result = PageService.create_page(page, db)
    return {
        "success": True,
        "message": "Page created successfully",
        "data": result
    }

# READ all endpoint (with pagination)
@page_router.get("", response_model=SuccessResponse[List[PageResponse]])
def list_pages(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    results = PageService.get_pages(db, skip, limit)
    return {
        "success": True,
        "message": "Pages retrieved successfully",
        "data": results
    }

# READ single endpoint
@page_router.get("/{page_id}", response_model=SuccessResponse[PageResponse])
def get_page(page_id: str, db: Session = Depends(get_db)):
    result = PageService.get_page_by_id(page_id, db)
    return {
        "success": True,
        "message": "Page retrieved successfully",
        "data": result
    }

# UPDATE endpoint
@page_router.patch("/{page_id}", response_model=SuccessResponse[PageResponse])
def update_page(page_id: str, page_data: UpdatePage, db: Session = Depends(get_db)):
    result = PageService.update_page(page_id, page_data, db)
    return {
        "success": True,
        "message": "Page updated successfully",
        "data": result
    }

# DELETE endpoint
@page_router.delete("/{page_id}", response_model=SuccessResponse[dict], status_code=status.HTTP_200_OK)
def delete_page(page_id: str, db: Session = Depends(get_db)):
    result = PageService.delete_page(page_id, db)
    return {
        "success": True,
        "message": "Page deleted successfully",
        "data": result
    }