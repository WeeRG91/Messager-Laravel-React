import { BsEmojiSmile, BsPlus } from "react-icons/bs";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { BiSend } from "react-icons/bi";
import clsx from "clsx";
import { saveMessage } from "@/Api/chat-message";
import { useChatMessageContext } from "@/Contexts/chat-message-context";
import { useChatContext } from "@/Contexts/chat-context";

export default function ContentFooter() {
  const { refreshChats } = useChatContext();
  const { user, messages, setMessages } = useChatMessageContext();

  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(48);
  const [processing, setProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const onSelectFile = () => {};

  const handleOnKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const onPressBackspace = e.key === "Backspace";
    const onPressEnter = e.key === "Enter";

    if (onPressEnter && !e.shiftKey) {
      e.preventDefault();
      handleOnSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }

    if (onPressBackspace) {
      const target = e.target as HTMLTextAreaElement;
      const lines = target.value.split("\n");

      if (target.offsetHeight > 48) {
        if (lines[lines.length - 1] === "") {
          setTextareaHeight((prev) => prev - 24);
        }
      }
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      const { scrollHeight, clientHeight } = textareaRef.current;
      if (scrollHeight !== clientHeight) {
        setTextareaHeight(scrollHeight + 4);
      }
    }
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);

    if (message === "") return;

    saveMessage({ user, message }).then((response) => {
      setMessage("");
      setTextareaHeight(48);
      textareaRef.current?.focus();
      setProcessing(false);

      const data = response.data.data;
      setMessages([...messages, data]);
      refreshChats();
    });
  };

  return (
    <form
      className="flex items-end gap-2 bg-background p-2 text-foreground"
      onSubmit={handleOnSubmit}
    >
      <label
        htmlFor="file"
        className="mb-1 cursor-pointer rounded-full p-2 text-primary-default transition-all hover:bg-secondary-default focus:bg-secondary-default"
      >
        <BsPlus className="h-8 w-8" />
        <input
          type="file"
          className="hidden"
          id="file"
          multiple
          onChange={onSelectFile}
        />
      </label>

      <div className="relative flex flex-1 items-end">
        <button
          className="absolute right-2 mb-2 text-primary-default"
          type="button"
        >
          <BsEmojiSmile className="h-8 w-8" />
        </button>
        <textarea
          placeholder="Aa"
          value={message}
          ref={textareaRef}
          onKeyDown={handleOnKeyDown}
          onChange={handleOnChange}
          className="max-h-[7rem] w-full resize-none rounded-xl border border-secondary-default bg-secondary-default pr-10 text-foreground focus:border-transparent focus:ring-transparent"
          style={{
            height: `${textareaHeight}px`,
          }}
        ></textarea>
      </div>

      <button
        type="submit"
        className={clsx(
          "mb-1 flex rounded-full p-2 transition-all disabled:cursor-not-allowed",
          message.trim().length === 0 &&
            "text-primary-default hover:bg-secondary-default focus:bg-secondary-default",
          message.trim().length > 0 && "bg-primary-default text-white",
        )}
      >
        <BiSend className="h-6 w-6" />
      </button>
    </form>
  );
}
