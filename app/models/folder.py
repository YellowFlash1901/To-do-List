import uuid
from sqlalchemy import Column, String, Text
from app.models.base import Base


class Folder(Base):
    __tablename__ = "folders"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name  = Column(Text, default="")
