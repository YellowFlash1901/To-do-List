import uuid
from fastapi import  FastAPI, status
import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, create_engine
from sqlalchemy.orm import Session
from pydantic import BaseModel


DATABASE_URL = "postgresql://postgres:example@db:5432/postgres"
engine = create_engine(DATABASE_URL)
session = Session(engine)

Base = declarative_base()


class Page(Base):
    __tablename__ = "pages"
    id    = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    content = Column(String)

Base.metadata.create_all(bind=engine)


app = FastAPI()


class Pagebase(BaseModel):
    title : str
    content: str

class CreatePage(Pagebase):
    pass

class PageResponse(Pagebase):
    pass

@app.post("/create-page", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
async def create_page(page: CreatePage):
    db_page = Page(**page.dict())
    session.add(db_page)
    session.commit()
    session.refresh(db_page)
    return db_page

