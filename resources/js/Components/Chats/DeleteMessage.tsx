import clsx from "clsx";
import { BsTrash } from "react-icons/bs";

type DeleteMessageProps = {
  className?: string;
};

export default function DeleteMessage({ className }: DeleteMessageProps) {
  const deleteConfirmation = () => {
    //Todo
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
