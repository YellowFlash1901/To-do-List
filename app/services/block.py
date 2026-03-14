from fastapi import  HTTPException
from app.schemas.block import CreateBlock, BlockResponse, UpdateBlock
from app.models.block import Block
from sqlalchemy.orm import Session

class BlockService:
    def create_block(self, block:CreateBlock, db: Session):
        try:
            db_block = Block(**block.dict())
            db.add(db_block)
            db.commit()
            db.refresh(db_block)
            return db_block
        except Exception as e:
            db.rollback()  # Undo if something fails
            raise HTTPException(status_code=500, detail="Failed to create page")        
        
    def get_block_by_id(self, block_id:str, db: Session):
        block = db.query(Block).filter(Block.block_id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        return block

    def get_blocks_by_page_id(self, page_id: str,db: Session):
        blocks = db.query(Block).filter(Block.page_id == page_id).all()
        if not blocks:
            raise HTTPException(status_code=404, detail="Block not found")

        return blocks

    def update_block(self, block_id:str ,block_data: UpdateBlock, db:Session):
        block = db.query(Block).filter(Block.block_id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        if block_data.type is not None:
            block.type = block_data.type
        if block_data.content is not None:
            block.content = block_data.content
        if block_data.position is not None:
            block.position = block_data.position
               
        # 3. Save
        db.commit()
        return block
    
    def delete_block(self, block_id:str , db:Session):
        block = db.query(Block).filter(Block.block_id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        db.delete(block)
        db.commit()
        return {"id": block_id, "message": "Block deleted successfully"}



BlockService = BlockService()