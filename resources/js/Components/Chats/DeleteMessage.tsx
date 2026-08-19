import clsx from "clsx";
import { BsTrash } from "react-icons/bs";
import { useModalContext } from "@/Contexts/modal-context";
import { ChatMessage } from "@/types/chat-message";

type DeleteMessageProps = {
  message: ChatMessage;
  className?: string;
};

export default function DeleteMessage({ message, className }: DeleteMessageProps) {
  const {openModal} = useModalContext();

  const deleteConfirmation = () => {
    openModal({
      view: "DELETE_MESSAGE_CONFORMATION",
      size: "lg",
      payload: message,
    });
  }

  return (
    <div
      className={clsx(
        "invisible flex flex-shrink-0 gap-2 group-hover:visible group-focus:visible",
        className,
      )}
    >
      <button
        className="btn btn-secondary rounded-full p-2"
        type="button"
        onClick={deleteConfirmation}
      >
        <BsTrash />
      </button>
    </div>
  );
}
