import { BiSearch } from "react-icons/bi";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { useChatContext } from "@/Contexts/chat-context";
import { fetchChats } from "@/Api/chat";
import { useDebounce } from "@/Hooks/use-debounce";

type ChatListSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ChatListSearch({
  search,
  setSearch,
}: ChatListSearchProps) {
  const { setChats, setPaginate } = useChatContext();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    setIsFirstLoading(false);
    if (!isFirstLoading) {
      fetchChats(debouncedSearch).then((response) => {
        setChats(response.data.data.data);
        setPaginate(response.data.data);
      });
    }
  }, [debouncedSearch]);

  const handleOnchange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center px-2 py-0">
      <span className="absolute left-5">
        <BiSearch className="text-2xl text-secondary-foreground" />
      </span>
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-lg border-secondary-default bg-background pl-10 focus:border-secondary-default focus:ring-transparent"
        value={search}
        onChange={handleOnchange}
      />
    </div>
  );
}
