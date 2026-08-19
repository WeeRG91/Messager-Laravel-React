import BadgeOnline from "@/Components/Chats/BadgeOnline";
import { CHAT_TYPE } from "@/types/chat";
import moment from "moment";
import { BsThreeDots, BsXLg } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { useChatMessageContext } from "@/Contexts/chat-message-context";
import { Link } from "@inertiajs/react";

type ContentHeaderProps = {
  onDrop: boolean;
  closeOnPreview: () => void;
};

export default function ContentHeader({
  onDrop,
  closeOnPreview,
}: ContentHeaderProps) {
  const { user, toggleSidebarRight } = useChatMessageContext();

  return (
    <div className="flex h-14 items-center justify-between border-b border-secondary-default p-2 shadow-sm">
      <div className="flex items-center gap-3">
        <Link
          href={route("chats.index")}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary-default focus:bg-secondary-default sm:hidden"
        >
          <FaArrowLeft />
        </Link>

        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full border border-secondary-default"
          />
          {user.is_online && <BadgeOnline className="!right-0" />}
        </div>

        <div className="leading-4">
          <h5 className="font-medium">{user.name}</h5>
          {user.chat_type === CHAT_TYPE.CHATS && (
            <span className="text-xs text-secondary-foreground">
              {user.is_online
                ? "Online"
                : moment(user.last_seen).format("DD/MM/YY H:mm")}
            </span>
          )}
        </div>
      </div>

      {onDrop ? (
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary-default focus:bg-secondary-default"
          onClick={closeOnPreview}
        >
          <BsXLg />
        </button>
      ) : (
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary-default focus:bg-secondary-default"
          onClick={toggleSidebarRight}
        >
          <BsThreeDots />
        </button>
      )}
    </div>
  );
}
