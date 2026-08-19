import { Attachment, ChatMessage } from "@/types/chat-message";
import DeleteSelectedFileInChat from "@/Components/Chats/DeleteSelectedFileInChat";
import { formatFileSize } from "@/utils";
import DeleteMessage from "@/Components/Chats/DeleteMessage";
import clsx from "clsx";
import moment from "moment";
import { BsFileEarmarkText } from "react-icons/bs";

type ChatMessageAttachmentProps = {
  message: ChatMessage;
  messageWithImages: Attachment[];
  messageWithFiles: Attachment[];
  className?: string;
  dir?: "ltr" | "rtl";
  selfDir?: "self-end" | "self-start";
  orderNumber?: "order-1" | "order-2" | "order-3";
};

export default function ChatMessageAttachment({
  message,
  messageWithImages,
  messageWithFiles,
  className,
  dir,
  selfDir,
  orderNumber,
}: ChatMessageAttachmentProps) {
  const downloadFile = (attachment: Attachment) => {
    window.open(`${attachment.file_path}/${attachment.file_name}`);
  };

  return (
    message.attachments &&
    message.attachments.length > 0 && (
      <div className={clsx("group relative flex gap-1", className)}>
        <div className={clsx("flex max-w-xs flex-col", orderNumber)}>
          {messageWithImages.length > 0 && (
            <div
              dir={dir}
              className={clsx(
                "grid",
                selfDir,
                messageWithImages.length === 1
                  ? "grid-cols-1"
                  : messageWithImages.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3",
              )}
            >
              {messageWithImages.map((attachment, index) => (
                <div
                  className="group/attachment relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl p-1 transition-all hover:bg-secondary-default"
                  key={`${attachment.file_name}-${index}`}
                >
                  <img
                    src={`${attachment.file_path}/${attachment.file_name}`}
                    alt={attachment.original_name}
                    className="h-full rounded-lg object-cover"
                  />

                  {message.attachments.length > 1 && (
                    <DeleteSelectedFileInChat
                      message={message}
                      attachment={attachment}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {messageWithFiles.length > 0 && (
            <div className="ml-auto grid max-w-xs grid-cols-1 gap-1">
              {messageWithFiles.map((attachment, index) => (
                <div
                  key={`${attachment.file_name}-${index}`}
                  className="group/attachment"
                >
                  <div
                    onClick={() => downloadFile(attachment)}
                    className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl bg-secondary-default/70 p-2 text-foreground transition-all hover:bg-secondary-default"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-default text-white">
                      <BsFileEarmarkText className="text-xl" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <h5 className="truncate font-medium">
                        {attachment.original_name}
                      </h5>
                      <div className="flex justify-between gap-2 text-xs">
                        <span>{formatFileSize(attachment.file_size)}</span>
                        <span className="ml-auto text-secondary-foreground">
                          {moment(message.created_at).format("H:mm")}
                        </span>
                      </div>
                    </div>

                    {message.attachments.length > 1 && (
                      <DeleteSelectedFileInChat
                        message={message}
                        attachment={attachment}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!message.body && (
          <DeleteMessage message={message} className="order-1 my-auto ml-auto mr-2" />
        )}
      </div>
    )
  );
}
