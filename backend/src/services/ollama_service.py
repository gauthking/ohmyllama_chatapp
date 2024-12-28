from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import sqlite3

class OllamaService:
    template = """
    Answer the question below.
    Here is the previous conversation history of Chat-{chatId}: {context}
    Question: {question}
    Answer:
    """
    def getResponse(self, promptDat:str, prevContext:str, chatId:int):
        model = OllamaLLM(model="phi3.5")
        prompt = ChatPromptTemplate.from_template(self.template)
        chain = prompt | model
        try:  
            result = chain.invoke({"context":prevContext, "question":promptDat, "chatId":chatId})
            return result
        except Exception as e:
            return f"An error occured - {str(e)}"
        
    def fetch_context(self, chat_id: int) -> str:
        conn = sqlite3.connect("D:\\MainFolders\\programcodestuff\\aimldatascience\\ohmyllama-chatapp\\ohmyllama\\src-tauri\\chats.db")
        cursor = conn.cursor()
        cursor.execute(
            "SELECT sender_msg, ai_res FROM messages WHERE chat_id = ? ORDER BY id ASC", (chat_id,)
        )
        messages = cursor.fetchall()
        conn.close()

        if not messages:
            return ""

        context = "\n".join([f"You: {msg[0]}\nAI: {msg[1]}" for msg in messages])
        
        return context




