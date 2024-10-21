from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.services.ollama_service import OllamaService

router = APIRouter()

class MessageInput(BaseModel):
    message:str

@router.post("/chat")
async def chat(input:MessageInput):
    service = OllamaService()
    try:
        response = service.getResponse(input.message)
        return {"response":response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))