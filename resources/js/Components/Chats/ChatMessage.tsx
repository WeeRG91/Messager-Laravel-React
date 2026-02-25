import { Fragment } from "react";
import moment from "moment";
import DeleteMessage from "@/Components/Chats/DeleteMessage";
import { useChatMessageContext } from "@/Contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/Contexts/app-context";

export default function ChatMessage() {
  const { auth } = useAppContext();
  const { user, messages, paginate } = useChatMessageContext();

  const sortedAndFilteredMessages = messages
    .sort((a, b) => a.sort_id - b.sort_id)
    .filter((message, index) => {
      return !(message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0);
    })
    .filter((message) => message.body || message.attachments.length > 0);

  return (
    <div className="relative flex flex-1 flex-col gap-1 overflow-x-hidden">
      {sortedAndFilteredMessages.map((message, index) => {
        const isFirstMessage = index === 0;
        const date = moment(message.created_at);
        const prevDate = sortedAndFilteredMessages[index - 1]?.created_at;
        const isDifferentDate = !date.isSame(prevDate, "date");

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMM YYYY")}
              </p>
            )}

            {message.from_id === user.id && message.from_id !== auth.id ? (
              <div className="flex flex-row justify-start">
                <div className="group relative flex items-center gap-2">
                  <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-secondary-default py-2 pl-2 pr-4 text-sm lg:max-w-md">
                    <p
                      className="my-auto overflow-auto"
                      dangerouslySetInnerHTML={{ __html: message.body }}
                    />
                    <span className="-mt-4 ml-auto text-xs">
                      {date.format("H:mm")}
                    </span>
                  </div>
                  <DeleteMessage />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="group relative flex flex-row-reverse items-center gap-2">
                  <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-primary-default py-2 pl-2 pr-4 text-sm text-white lg:max-w-md">
                    <span className="-mt-4 ml-auto text-xs">
                      {date.format("H:mm")}
                    </span>
                    <p
                      className="my-auto overflow-auto"
                      dangerouslySetInnerHTML={{ __html: message.body }}
                    />
                  </div>
                  <DeleteMessage />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
