import uuid
from sqlalchemy import Column, String
from app.models.base import Base
    
class Page(Base):
    __tablename__ = "pages"
    id    = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    content = Column(String) 
