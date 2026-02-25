import { Config } from "ziggy-js";
import { User } from "@/types/user";
import { ChatPaginate } from "@/types/chat";
import {
  Attachment,
  ChatMessagePaginate,
  ChatProfile,
  Link,
} from "@/types/chat-message";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
};

export type ChatPageProps = PageProps<{ chats: ChatPaginate }>;

export type ChatMessagePageProps = PageProps<{
  chats: ChatPaginate;
  user: ChatProfile;
  messages: ChatMessagePaginate;
  media: Attachment[];
  files: Attachment;
  links: Link[];
}>;
