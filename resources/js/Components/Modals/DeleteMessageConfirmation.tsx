import Modal from "@/Components/Modals/Modal";
import { useModalContext } from "@/Contexts/modal-context";
import { Fragment } from "react";
import { ChatMessage } from "@/types/chat-message";
import { deleteMessage } from "@/Api/chat-message";
import { useChatContext } from "@/Contexts/chat-context";
import { useChatMessageContext } from "@/Contexts/chat-message-context";

export default function DeleteMessageConfirmation() {
  const { closeModal, data: message } = useModalContext<ChatMessage>();
  const { refreshChats } = useChatContext();
  const { messages, setMessages } = useChatMessageContext();

  if (!message) return;

  const handleDeleteMessage = () => {
    deleteMessage(message).then(() => {
      refreshChats();
      setMessages([...messages.filter((m) => m.id !== message.id)]);

      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header title="Delete Message?" onClose={closeModal} />

      <Modal.Body as={Fragment}>
        <p>
          This message will be removed for you. Others in the chat will be able
          to see it.
        </p>

        {message && message.attachments.length > 0 && (
          <p>{message.attachments.length} files will be removed for you.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteMessage}>
          Delete for me
        </button>
      </Modal.Footer>
    </Modal>
  );
}
