import { Link, usePage } from "@inertiajs/react";
import { ChatPageProps } from "@/types";
import { Chat } from "@/types/chat";
import BadgeOnline from "@/Components/Chats/BadgeOnline";
import clsx from "clsx";
import { relativeTime } from "@/utils";

type ChatListProps = {
  search: string;
  href: string;
  type: "chats" | "archived_chats";
  className?: string;
};

export default function ChatList({
  search,
  type,
  href,
  className,
}: ChatListProps) {
  const { chats } = usePage<ChatPageProps>().props;

  const handleMarkAsRead = (chat: Chat) => {
    // Mark as read
  };

  return (
    <div className="relative max-h-[calc(100vh_-_158px)] flex-1 overflow-y-auto px-2 pb-1 sm:max-h-max sm:pb-2">
      {chats.data
        .sort((a, b) => {
          if (search.length === 0)
            return b.created_at.localeCompare(a.created_at);
          return a.name.localeCompare(b.name);
        })
        .map((chat) => (
          <div key={chat.id} className="group relative flex items-center">
            <Link
              href={route(href, chat.id)}
              as="button"
              onClick={() => handleMarkAsRead(chat)}
              className={clsx(
                "flex1 relative p-3 flex w-full items-center gap-3 rounded-lg text-left transition-all group-hover:bg-secondary-default",
                className,
              )}
            >
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-12 w-12 rounded-full border border-secondary-default"
                />
                {chat.is_online && <BadgeOnline />}
              </div>

              <div className="overflow-hidden">
                <h5 className="truncate font-medium">{chat.name}</h5>
                <div className="flex items-center text-sm text-secondary-foreground">
                  <p
                    className={clsx(
                      "truncate",
                      !chat.is_read && "font-medium text-foreground",
                    )}
                    dangerouslySetInnerHTML={{ __html: chat.body }}
                  />
                  <span className="mx-1">.</span>
                  <span className="shrink-0">{relativeTime(chat.created_at)}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
