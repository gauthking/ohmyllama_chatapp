import { useChatStore } from "../store/chatStore";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { invoke } from "@tauri-apps/api/core";

const ChatSide: React.FC = () => {
  const { currentChat } = useChatStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat?.messages) {
      setMessages(currentChat.messages);
    }
  }, [currentChat]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !currentChat) return;

    const tempMessage = {
      senderMsg: userMessage,
      AiRes: "Loading...",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setUserMessage("");

    try {
      const response: string = await invoke("chat_with_ollama", {
        message: userMessage,
        chatId: currentChat.chatId,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].AiRes = response;
        return updated;
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <main className="w-[78%] m-4 p-3 h-full flex flex-col">
      <section className="chat_wall h-full m-3 border-2 border-gray-800 rounded-2xl shadow-sm shadow-purple-900 flex-grow overflow-y-auto p-4 w-full bg-zinc-950">
        {messages.map((msg, index) => (
          <div key={index} className="my-4 font-promptRegular">
            {msg.senderMsg && (
              <div className="flex justify-end mb-2">
                <div className="bg-purple-700 text-white p-3 rounded-xl max-w-xs shadow-md">
                  <p className="text-sm">{msg.senderMsg}</p>
                  <span className="text-xs text-gray-300 float-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )}

            {msg.AiRes && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-xl max-w-xl shadow-md">
                  <p className="text-sm">{msg.AiRes}</p>
                  <span className="text-xs text-gray-500 float-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </section>

      <section className="chat_prompt mt-auto mb-4 bg-zinc-900 rounded-xl flex">
        <input
          className="p-4 w-full font-promptRegular bg-zinc-800 rounded-xl outline-none text-white"
          type="text"
          placeholder="Type your prompt here..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <ArrowRightIcon
          onClick={handleSendMessage}
          color="rgb(65, 58, 87)"
          className="cursor-pointer hover:scale-x-125 transition-all ease-in-out"
          width={32}
        />
      </section>
    </main>
  );
};

export default ChatSide;
