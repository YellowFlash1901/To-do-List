import uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String


Base = declarative_base()

class Page(Base):
    __tablename__ = "pages"
    id    = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    content = Column(String)