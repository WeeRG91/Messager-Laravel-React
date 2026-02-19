import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import ChatListSearch from "@/Components/Chats/ChatListSearch";
import ChatList from "@/Components/Chats/ChatList";
import { useChatContext } from "@/Contexts/chat-context";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const { chats } = useChatContext();

  return (
    <div className="order-1 flex flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary-default lg:w-[360px]">
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">Chats</h3>
        <button className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-default text-white">
          <FaUsers />
        </button>
      </div>

      {/*searching*/}
      <ChatListSearch search={search} setSearch={setSearch} />

      {/*chats recently*/}
      <ChatList search={search} href="chats.show" type="chats" />

      {/*message (user not found, no chat yet)*/}
      {chats.length === 0 && search.length > 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          User not found
        </p>
      )}

      {chats.length === 0 && search.length === 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          No chat yet
        </p>
      )}
    </div>
  );
}
