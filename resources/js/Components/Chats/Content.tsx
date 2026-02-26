import clsx from "clsx";
import ContentHeader from "@/Components/Chats/ContentHeader";
import ContentBody from "@/Components/Chats/ContentBody";
import ContentFooter from "@/Components/Chats/ContentFooter";
import { useEffect, useRef } from "react";

export default function Content() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (bottomRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = bottomRef.current.offsetTop;
    }
  };

  return (
    <div
      className={clsx(
        "relative order-3 flex h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary-default sm:border-l",
      )}
    >
      <ContentHeader />
      <ContentBody
        chatContainerRef={chatContainerRef}
        bottomRef={bottomRef}
        scrollToBottom={scrollToBottom}
      />
      <ContentFooter scrollToBottom={scrollToBottom} />
    </div>
  );
}
