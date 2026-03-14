from fastapi import APIRouter, status, Depends
from typing import List
from app.schemas.block import CreateBlock, UpdateBlock, BlockResponse, SuccessResponse
from app.services.block import BlockService
from app.database import get_db
from sqlalchemy.orm import Session

block_router = APIRouter(prefix="/blocks", tags=["blocks"])

# CREATE endpoint
@block_router.post("", response_model=SuccessResponse[BlockResponse], status_code=status.HTTP_201_CREATED)
def create_block(block: CreateBlock, db: Session = Depends(get_db)):
    result = BlockService.create_block(block, db)
    return {
        "success": True,
        "message": "Block created successfully",
        "data": result
    }

# GET all blocks for a page
@block_router.get("/page/{page_id}", response_model=SuccessResponse[List[BlockResponse]])
def get_blocks_by_page(page_id: str, db: Session = Depends(get_db)):
    results = BlockService.get_blocks_by_page_id(page_id, db)
    return {
        "success": True,
        "message": "Blocks retrieved successfully",
        "data": results
    }

# UPDATE endpoint
@block_router.patch("/{block_id}", response_model=SuccessResponse[BlockResponse])
def update_block(block_id: str, block_data: UpdateBlock, db: Session = Depends(get_db)):
    result = BlockService.update_block(block_id, block_data, db)
    return {
        "success": True,
        "message": "Block updated successfully",
        "data": result
    }

# DELETE endpoint
@block_router.delete("/{block_id}", response_model=SuccessResponse[dict], status_code=status.HTTP_200_OK)
def delete_block(block_id: str, db: Session = Depends(get_db)):
    result = BlockService.delete_block(block_id, db)
    return {
        "success": True,
        "message": "Block deleted successfully",
        "data": result
    }
