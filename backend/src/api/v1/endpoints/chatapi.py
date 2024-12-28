from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.services.ollama_service import OllamaService

router = APIRouter()

class MessageInput(BaseModel):
    message:str
    chatId:int

@router.post("/chat")
async def chat(input:MessageInput):
    service = OllamaService()
    try:
        recent_context = service.fetch_context(input.chatId)
        print("Recent context", recent_context)
        response = service.getResponse(input.message,recent_context,input.chatId)
        return {"response":response}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))