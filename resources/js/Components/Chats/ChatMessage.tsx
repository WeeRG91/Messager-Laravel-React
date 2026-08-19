import { Fragment } from "react";
import moment from "moment";
import DeleteMessage from "@/Components/Chats/DeleteMessage";
import { useChatMessageContext } from "@/Contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/Contexts/app-context";
import { isImageLinkValid } from "@/utils";
import clsx from "clsx";
import ChatMessageAttachment from "@/Components/Chats/ChatMessageAttachment";

export default function ChatMessage() {
  const { auth } = useAppContext();
  const { user, messages } = useChatMessageContext();

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
        const messageWithImages = message.attachments.filter((attachment) =>
          isImageLinkValid(attachment.original_name),
        );
        const messageWithFiles = message.attachments.filter(
          (attachment) => !isImageLinkValid(attachment.original_name),
        );

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMM YYYY")}
              </p>
            )}

            {message.from_id === user.id && message.from_id !== auth.id ? (
              <div className="flex flex-row justify-start">
                <div className="text-sm">
                  {message.body && (
                    <div className="group relative flex items-center gap-2">
                      <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-secondary-default py-2 pl-2 pr-4 text-sm lg:max-w-md">
                        <p
                          className="my-auto overflow-auto"
                          dangerouslySetInnerHTML={{ __html: message.body }}
                        />
                        <span className="-mt-4 ml-auto text-xs text-secondary-foreground">
                          {date.format("H:mm")}
                        </span>
                      </div>
                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="text-sm text-white">
                  {message.body && (
                    <div
                      className={clsx(
                        "group relative flex-row-reverse items-center gap-2",
                        message.body ? "flex" : "hidden",
                      )}
                    >
                      <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-primary-default py-2 pl-2 pr-4 text-sm text-white lg:max-w-md">
                        <span className="-mt-4 ml-auto text-xs text-white/50">
                          {date.format("H:mm")}
                        </span>
                        <p
                          className="my-auto overflow-auto"
                          dangerouslySetInnerHTML={{ __html: message.body }}
                        />
                      </div>
                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    className="justify-end"
                    dir="rtl"
                    selfDir="self-end"
                    orderNumber="order-2"
                  />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
