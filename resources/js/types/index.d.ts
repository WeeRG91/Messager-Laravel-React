import { Config } from 'ziggy-js';
import { User } from "@/types/user";
import { ChatPaginate } from "@/types/chat";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export type ChatPageProps = PageProps<{chats: ChatPaginate}>;
