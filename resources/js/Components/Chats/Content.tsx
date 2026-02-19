import clsx from "clsx";
import ContentHeader from "@/Components/Chats/ContentHeader";
import ContentBody from "@/Components/Chats/ContentBody";
import ContentFooter from "@/Components/Chats/ContentFooter";

export default function Content() {
  return (
    <div
      className={clsx(
        "relative order-3 flex h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary-default sm:border-l",
      )}
    >
      <ContentHeader />
      <ContentBody />
      <ContentFooter />
    </div>
  );
}
