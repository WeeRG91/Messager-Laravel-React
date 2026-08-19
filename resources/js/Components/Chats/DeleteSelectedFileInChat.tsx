import { Attachment, ChatMessage } from "@/types/chat-message";
import { BsX } from "react-icons/bs";
import { deleteFileInChat } from "@/Api/chat-message";
import { useChatMessageContext } from "@/Contexts/chat-message-context";

type DeleteSelectedFileInChatProps = {
  message: ChatMessage;
  attachment: Attachment;
};

export default function DeleteSelectedFileInChat({
  message,
  attachment,
}: DeleteSelectedFileInChatProps) {
  const { messages, setMessages } = useChatMessageContext();

  const deleteSelectedFile = () => {
    deleteFileInChat(message, attachment).then(() => {
      const updatedAttachments = message.attachments.filter(
        (a) => a.file_name !== attachment.file_name,
      );

      setMessages(
        messages.map((m) => {
          if (m.id === message.id) {
            m.attachments = updatedAttachments;
          }

          return m;
        }),
      );
    });
  };

  return (
    <button
      className="absolute right-2 top-2 z-10 hidden h-4 w-4 items-center justify-center rounded-full bg-danger-default text-white group-hover/attachment:flex"
      onClick={deleteSelectedFile}
    >
      <BsX />
    </button>
  );
}
