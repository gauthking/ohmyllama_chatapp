import { useChatStore } from "../store/chatStore";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ChatState } from "../@types/types";
import { TrashIcon } from "@heroicons/react/16/solid";

const Sidebar = () => {
  const { setCurrentChat, currentChat } = useChatStore();
  const [chats, setChats] = useState<ChatState[]>([]);

  const handleNewChat = async () => {
    try {
      const response: any = await invoke("create_new_chat", {
        title: "New Chat",
      });
      console.log("New Chat Response:", response);
      fetchChats();

      if (response.chatId) {
        setCurrentChat({
          chatId: response.chatId,
          chatTitle: "New Chat",
          createdAt: new Date().toISOString(),
          messages: [],
          lastContextChunk: "",
        });
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const deleteChat = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await invoke("delete_chat", { chatId: id });
      console.log(response);
      fetchChats();

      if (currentChat?.chatId === id) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error("Failed to delete the chat:", error);
      alert(`Failed to delete the chat: ${error}`);
    }
  };

  const fetchChats = async () => {
    try {
      const chatHistory = await invoke<ChatState[]>("fetch_chat_history");
      setChats(chatHistory);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <main className="h-full w-[22%] m-4 p-3 rounded-xl shadow-sm bg-zinc-950 flex flex-col justify-between">
      <section className="w-full upper">
        <header className="mx-4 font-promptBold text-gray-200 opacity-80 my-2">
          🦙ohmyllama
        </header>
        <button
          onClick={() => handleNewChat()}
          className="w-full rounded-lg p-2 text-neutral-100 bg-purple-950 my-2 text-center hover:scale-105 transition-all ease-in-out hover:bg-purple-900 font-promptLight"
        >
          + New Chat
        </button>

        <div className="h-[0.5px] bg-zinc-700 m-auto w-full mt-3"></div>

        <p className="font-promptMedium text-gray-300 opacity-55 mx-2">
          Chat History
        </p>
        <section className="chats w-full my-4 mx-1 flex flex-col">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              className={`flex justify-between flex-grow text-white shadow-sm ${
                currentChat?.chatId === chat.chatId
                  ? "bg-purple-900"
                  : "hover:bg-zinc-900"
              } hover:scale-105 hover:shadow-none transition-all ease-in-out p-2 rounded-xl cursor-pointer my-1`}
              onClick={() => setCurrentChat(chat)}
            >
              <p className="font-promptLight">{chat.chatTitle}</p>
              <TrashIcon
                onClick={(e) => deleteChat(chat.chatId, e)}
                className="hover:scale-110 transition-all ease-in-out cursor-pointer"
                width={17}
              />
            </div>
          ))}
        </section>
      </section>
    </main>
  );
};

export default Sidebar;
