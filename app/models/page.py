import uuid
from sqlalchemy import Column, String, ForeignKey
from app.models.base import Base

class Page(Base):
    __tablename__ = "pages"
    id    = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    folder_id = Column(String, ForeignKey("folders.id"), nullable=True, index=True)
    title = Column(String)
    content = Column(String) 
