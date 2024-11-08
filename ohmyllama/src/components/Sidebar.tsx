import { useChatStore } from "../store/chatStore";

const Sidebar = () => {
  const { setMessage } = useChatStore();
  return (
    <main className="h-full w-[22%] m-4 p-3 rounded-xl shadow-sm bg-zinc-950 flex flex-col justify-between">
      <section className="w-full upper">
        <header className="mx-4 font-promptBold text-gray-200 opacity-80 my-2">
          🦙ohmyllama
        </header>
        <button
          onClick={() => setMessage("new msg")}
          className="w-full rounded-lg p-2 text-neutral-100 bg-purple-950 my-2 text-center hover:scale-105 transition-all ease-in-out hover:bg-purple-900 font-promptLight"
        >
          + New Chat
        </button>

        <div className="h-[0.5px] bg-zinc-700 m-auto w-full mt-3"></div>

        <p className="font-promptMedium text-gray-300 opacity-55 mx-2 ">
          Chat History
        </p>
        <section className="chats w-full my-4 mx-1 flex flex-col">
          <div className="flex flex-grow text-white shadow-sm shadow-purple-950 hover:bg-zinc-900 hover:scale-105 hover:shadow-none transition-all ease-in-out p-2 rounded-xl cursor-pointer my-1">
            <p className="font-promptLight">Formatting mail document...</p>
          </div>
          <div className="flex flex-grow text-white shadow-sm shadow-purple-950 hover:bg-zinc-900 hover:scale-105 hover:shadow-none transition-all ease-in-out p-2 rounded-xl cursor-pointer my-1">
            <p className="font-promptLight">Node.js chat app tutorial...</p>
          </div>
        </section>
      </section>

      <section className="w-full lower text-white"></section>
    </main>
  );
};

export default Sidebar;
