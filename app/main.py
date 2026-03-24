from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pages import page_router
from app.routes.folders import folder_router
from app.routes.blocks import block_router
from app.database import engine
from app.models.page import Page       
from app.models.folder import Folder                                                                                                                                             
from app.models.block import Block
from app.models.base import Base

app = FastAPI(title="Notion Lite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(page_router)
app.include_router(block_router)
app.include_router(folder_router)
