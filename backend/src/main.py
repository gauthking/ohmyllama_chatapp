from fastapi import FastAPI
from src.api.v1.endpoints import chatapi

app = FastAPI()

app.include_router(chatapi.router, prefix="/api/v1")