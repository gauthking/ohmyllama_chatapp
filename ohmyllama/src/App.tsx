// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import ChatSide from "./components/ChatSide";
import Sidebar from "./components/Sidebar";

function App() {
  // const [message, setMessage] = useState("");
  // const [response, setResponse] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleChat = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await invoke("chat_with_ollama", { message });
  //     setResponse(result as string);
  //   } catch (error) {
  //     setResponse("Error: " + error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const formatResponse = (text: any) => {
  //   return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
  // };

  return (
    <main className="h-screen w-full flex">
      <Sidebar />
      <ChatSide />
    </main>
  );
}

export default App;
