import { ChatProfile } from "@/types/chat-message";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { usePage } from "@inertiajs/react";
import { ChatMessagePageProps } from "@/types";
import { CHAT_TYPE } from "@/types/chat";
import { User } from "@/types/user";

type State = {
  user: ChatProfile;
  showSidebarRight: boolean;
  setUser: (value: ChatProfile) => void;
  toggleSidebarRight: () => void;
};

type Action =
  | {
      type: "SET_USER";
      payload: ChatProfile;
    }
  | { type: "TOGGLE_SIDEBAR_RIGHT" };

const initialState: State = {
  user: {
    id: "",
    name: "",
    email: "",
    email_verified_at: "",
    avatar: "",
    active_status: true,
    is_online: false,
    last_seen: "",
    chat_type: CHAT_TYPE.CHATS,
    message_color: "",
    is_contact_blocked: false,
    is_contact_saved: false,
    description: "",
    creator_id: "",
    creator: {
      id: "",
      name: "",
    },
    members_count: 0,
  },
  showSidebarRight: false,
  setUser: () => {},
  toggleSidebarRight: () => {},
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "TOGGLE_SIDEBAR_RIGHT":
      const value = localStorage.getItem("toggle-sidebar-right") === "true";
      localStorage.setItem("toggle-sidebar-right", String(!value));

      return {
        ...state,
        showSidebarRight: !value,
      };
  }
};

const ChatMessageContext = createContext(initialState);

export const useChatMessageContext = () => useContext(ChatMessageContext);

export const ChatMessageProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<ChatMessagePageProps>().props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const setUser = (value: ChatProfile) => {
    dispatch({ type: "SET_USER", payload: value });
  };

  const toggleSidebarRight = () => {
    dispatch({ type: "TOGGLE_SIDEBAR_RIGHT" });
  };

  useEffect(() => {
    setIsFirstLoading(false);
    setUser(props.user);
  }, []);

  const value = {
    ...state,
    user: isFirstLoading ? props.user : state.user,
    showSidebarRight: localStorage.getItem("toggle-sidebar-right") === "true",
    setUser,
    toggleSidebarRight,
  };

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};
