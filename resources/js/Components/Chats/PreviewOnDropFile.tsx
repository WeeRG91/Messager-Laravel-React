import { BsX } from "react-icons/bs";
import { Preview } from "@/Components/Chats/Content";
import { formatFileSize, isImageLinkValid } from "@/utils";
import { BsFileEarmarkText } from "react-icons/bs";
import clsx from "clsx";

type PreviewOnDropFileProps = {
  onDrop: boolean;
  closeOnPreview: () => void;
  selectedPreview: Preview;
  setSelectedPreview: (value: Preview) => void;
  attachments: Preview[];
  setAttachments: (value: Preview[]) => void;
};

export default function PreviewOnDropFile({
  onDrop,
  closeOnPreview,
  selectedPreview,
  setSelectedPreview,
  attachments,
  setAttachments,
}: PreviewOnDropFileProps) {
  const changeSelectedPreview = (file: Preview) => {
    setSelectedPreview(file);
  };

  const removeAttachment = (file: Preview) => {
    setAttachments(attachments.filter((f) => f.preview !== file.preview));

    const index = attachments.findIndex((f) => f.preview === file.preview);

    if (index === 0) {
      setSelectedPreview(attachments[index + 1]);
    } else if (index > 0 && file.preview === file.preview) {
      setSelectedPreview(attachments[index - 1]);
    }

    if (attachments.length - 1 === 0) closeOnPreview();
  };

  return (
    onDrop && (
      <div className="relative flex h-full max-h-[100vh_-_120px] flex-1 flex-col overflow-auto p-2 pt-8">
        <div className="flex h-full flex-1 items-center justify-center overflow-hidden p-2">
          {isImageLinkValid(selectedPreview.name) ? (
            <img
              src={selectedPreview.preview}
              alt={selectedPreview.name}
              className="max-h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-secondary-default">
                <BsFileEarmarkText className="text-3xl" />
              </div>
              <div className="text-center">
                <h5 className="font-medium">{selectedPreview.name}</h5>
                <span className="text-xs">
                  {formatFileSize(selectedPreview.size)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-1 overflow-auto">
          {attachments.map((file, index) => (
            <div key={`${file.name}-${index}`} className="group relative">
              <button
                className={clsx(
                  "flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-secondary-default transition-all hover:border-primary-default focus:border-primary-default",
                  selectedPreview.preview === file.preview
                    ? "border-primary-default"
                    : "border-transparent",
                )}
                onClick={() => changeSelectedPreview(file)}
              >
                {isImageLinkValid(file.name) ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="max-h-full object-cover"
                  />
                ) : (
                  <span className="flex h-[56px] w-[56px] shrink-0 items-center justify-center">
                    <BsFileEarmarkText className="text-3xl" />
                  </span>
                )}
              </button>

              <button
                onClick={() => removeAttachment(file)}
                className="absolute right-1 top-1 z-10 hidden h-4 w-4 items-center justify-center rounded-full bg-danger-dark text-white group-hover:flex"
              >
                <BsX />
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
