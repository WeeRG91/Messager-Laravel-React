import { Link } from "@inertiajs/react";
import { Chat } from "@/types/chat";
import BadgeOnline from "@/Components/Chats/BadgeOnline";
import clsx from "clsx";
import { relativeTime } from "@/utils";
import { useChatContext } from "@/Contexts/chat-context";
import BadgeChatNotification from "@/Components/Chats/BadgeChatNotification";

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
  const { chats } = useChatContext();

  const handleMarkAsRead = (chat: Chat) => {
    // Mark as read
  };

  if (chats.length === 0) return;

  return (
    <div
      className={clsx(
        "relative max-h-[calc(100vh_-_158px)] flex-1 overflow-y-auto px-2 pb-1 sm:max-h-max sm:pb-2",
        className,
      )}
    >
      {chats
        .sort((a, b) => {
          if (search.length === 0)
            return b.created_at.localeCompare(a.created_at);
          return a.name.localeCompare(b.name);
        })
        .map((chat, index) => (
          <div key={index} className="group relative flex items-center">
            <Link
              href={route(href, chat.id)}
              as="button"
              onClick={() => handleMarkAsRead(chat)}
              className={clsx(
                "flex1 relative flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all group-hover:bg-secondary-default",
                className,
              )}
            >
              {search.length === 0 && chat.created_at ? (
                <>
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
                      <span className="shrink-0">
                        {relativeTime(chat.created_at)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="h-10 w-10 rounded-full border border-secondary-default"
                    />
                    {chat.is_online && <BadgeOnline />}
                  </div>

                  <div className="overflow-hidden">
                    <h5 className="truncate font-medium">{chat.name}</h5>
                  </div>
                </>
              )}

              {!chat.is_read && <BadgeChatNotification />}
            </Link>
          </div>
        ))}
    </div>
  );
}
