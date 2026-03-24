from fastapi import  HTTPException
from app.schemas.folder import CreateFolder, FolderResponse, UpdateFolderName
from app.models.folder import Folder
from sqlalchemy.orm import Session
from app.models.page import Page
 
class FolderService:
    def create_folder(self, folder:CreateFolder, db: Session):
        try:
            db_folder = Folder(**folder.dict())
            db.add(db_folder)
            db.commit()
            db.refresh(db_folder)
            return db_folder
        except Exception as e:
            db.rollback()  # Undo if something fails
            raise HTTPException(status_code=500, detail="Failed to create folder")        
        
    def get_folder(self, folder_id:str, db: Session):
        folder = db.query(Folder).filter(Folder.id == folder_id).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        return folder

    def get_all_folders(self, db: Session):
        return db.query(Folder).all()

    def get_pages_by_folder(self, folder_id: str,db: Session):
        return db.query(Page).filter(Page.folder_id == folder_id).all()

    
    def update_folder_name(self, folder_id:str ,folder_data: UpdateFolderName, db:Session):
        folder = db.query(Folder).filter(Folder.id == folder_id).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        if folder_data.name is not None:
            folder.name = folder_data.name        
        # 3. Save
        db.commit()
        return folder
    
    def delete_folder(self, folder_id:str , db:Session):
        folder = db.query(Folder).filter(Folder.id == folder_id).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        db.delete(folder)
        db.commit()
        return {"id": folder_id, "message": "Folder deleted successfully"}



FolderService = FolderService()
