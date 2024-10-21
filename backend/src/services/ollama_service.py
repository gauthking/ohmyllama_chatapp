from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

class OllamaService:
    template = """
    Answer the question below.
    Here is the conversation history: {context}
    Question: {question}
    Answer:
    """
    def getResponse(self, promptDat:str):
        model = OllamaLLM(model="phi3.5")
        prompt = ChatPromptTemplate.from_template(self.template)
        chain = prompt | model
        try:  
            result = chain.invoke({"context":"", "question":promptDat})
            return result
        except Exception as e:
            return f"An error occured - {str(e)}"




