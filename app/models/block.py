import uuid
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from app.models.base import Base


class Block(Base):
    __tablename__ = "blocks"
    block_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    page_id  = Column(String, ForeignKey("pages.id"), index=True)
    type     = Column(String(50), nullable=False)   # "text", "heading", "image", "code"
    content  = Column(Text, default="")
    position = Column(Integer, nullable=False)  