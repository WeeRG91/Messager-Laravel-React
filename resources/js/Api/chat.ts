import { AxiosResponse } from "axios";
import { ChatPaginate } from "@/types/chat";

export const fetchChats = (query?: string): Promise<AxiosResponse<{data: ChatPaginate}>> => {
  return window.axios.get(`${route("chats.users")}?query=${query || ""}`);
};
