import clsx from "clsx";
import ContentHeader from "@/Components/Chats/ContentHeader";
import ContentBody from "@/Components/Chats/ContentBody";
import ContentFooter from "@/Components/Chats/ContentFooter";
import { useEffect, useRef, useState } from "react";
import DragFileOverlay from "@/Components/Chats/DragFileOverlay";
import PreviewOnDropFile from "@/Components/Chats/PreviewOnDropFile";

export type Preview = File & {
  preview: string;
};

export default function Content() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [onDrag, setOnDrag] = useState<boolean>(false);
  const [onDrop, setOnDrop] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Preview[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<Preview>();

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (bottomRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = bottomRef.current.offsetTop;
    }
  };

  const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOnDrag(false);
    }
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length === 0) {
      return setOnDrag(false);
    }

    onSelectOrPreviewFiles(files);
  };

  const onSelectOrPreviewFiles = (files: FileList | null) => {
    if (!files || !files.length) return;

    const droppedFiles = Array.from(files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setAttachments([...attachments, ...droppedFiles]);
    setSelectedPreview(droppedFiles[0]);

    setOnDrag(false);
    setOnDrop(true);
  };

  const closeOnPreview = () => {
    setOnDrop(false);
    setAttachments([]);
  };

  return (
    <div
      className={clsx(
        "relative order-3 flex h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary-default sm:border-l",
      )}
      tabIndex={0}
      onDragEnter={() => setOnDrag(true)}
      onDragLeave={handleOnDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleOnDrop}
    >
      <ContentHeader onDrop={onDrop} closeOnPreview={closeOnPreview} />
      <ContentBody
        chatContainerRef={chatContainerRef}
        bottomRef={bottomRef}
        scrollToBottom={scrollToBottom}
        onDrop={onDrop}
      />

      <PreviewOnDropFile
        onDrop={onDrop}
        closeOnPreview={closeOnPreview}
        selectedPreview={selectedPreview as Preview}
        setSelectedPreview={setSelectedPreview}
        attachments={attachments}
        setAttachments={setAttachments}
      />
      <DragFileOverlay onDrag={onDrag} onDrop={onDrop} />

      <ContentFooter scrollToBottom={scrollToBottom} attachments={attachments} closeOnPreview={closeOnPreview} onSelectOrPreviewFiles={onSelectOrPreviewFiles} />
    </div>
  );
}
