from fastapi import  HTTPException
from app.schemas.page import CreatePage, PageResponse, UpdatePage
from app.models.page import Page
from sqlalchemy.orm import Session

class PageService:
    def create_page(self, page:CreatePage, db: Session):
        try:
            db_page = Page(**page.dict())
            db.add(db_page)
            db.commit()
            db.refresh(db_page)
            return db_page
        except Exception as e:
            db.rollback()  # Undo if something fails
            raise HTTPException(status_code=500, detail="Failed to create page")        
        
    def get_page_by_id(self, page_id:str, db: Session):
        page = db.query(Page).filter(Page.id == page_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return page

    def get_pages(self, db: Session, skip: int = 0, limit: int = 10):
        pages = db.query(Page).offset(skip).limit(limit).all()
        return pages

    def update_page(self, page_id:str ,page_data: UpdatePage, db:Session):
        page = db.query(Page).filter(Page.id == page_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        # 2. Update it
        if page_data.title is not None:  # Only update if provided
           page.title = page_data.title
        if page_data.content is not None:
           page.content = page_data.content

        # 3. Save
        db.commit()
        return page
    
    def delete_page(self, page_id:str , db:Session):
        page = db.query(Page).filter(Page.id == page_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        db.delete(page)
        db.commit()
        return {"id": page_id, "message": "Page deleted successfully"}
        


PageService = PageService()