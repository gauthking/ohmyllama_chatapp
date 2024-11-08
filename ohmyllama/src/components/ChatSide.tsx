import { useChatStore } from "../store/chatStore";

const ChatSide: React.FC = () => {
  const { message } = useChatStore();
  console.log(message);
  return (
    <main className="w-[78%] m-4 p-3 h-full flex flex-col">
      <section className="chat_wall flex-grow overflow-y-auto"></section>

      <section className="chat_prompt mt-auto mb-4">
        <input
          className="p-4 w-full rounded-xl font-promptRegular outline-none bg-zinc-900 text-white"
          type="text"
          placeholder="Type your prompt in here..."
        />
      </section>
    </main>
  );
};

export default ChatSide;
