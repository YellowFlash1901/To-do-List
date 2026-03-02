from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pages import page_router
from app.database import engine
from app.models.page import Base

app = FastAPI(title="Notion Lite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(page_router)

