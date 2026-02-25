import {
  ChatMessage,
  ChatMessagePaginate,
  ChatProfile,
} from "@/types/chat-message";
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
import { InitialPaginate } from "@/types/paginate";

type State = {
  messages: ChatMessage[];
  paginate: ChatMessagePaginate;
  setMessages: (value: ChatMessage[]) => void;
  setPaginate: (value: ChatMessagePaginate) => void;
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
  | { type: "TOGGLE_SIDEBAR_RIGHT" }
  | {
      type: "SET_MESSAGES";
      payload: ChatMessage[];
    }
  | {
      type: "SET_PAGINATE";
      payload: ChatMessagePaginate;
    };

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
    created_at: "",
    updated_at: "",
  },
  showSidebarRight: false,
  setUser: () => {},
  toggleSidebarRight: () => {},
  messages: [],
  paginate: InitialPaginate,
  setMessages: () => {},
  setPaginate: () => {},
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
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "SET_PAGINATE":
      return {
        ...state,
        paginate: action.payload,
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

  const setMessages = (value: ChatMessage[]) => {
    dispatch({ type: "SET_MESSAGES", payload: value });
  };
  const setPaginate = (value: ChatMessagePaginate) => {
    dispatch({ type: "SET_PAGINATE", payload: value });
  };

  useEffect(() => {
    setIsFirstLoading(false);
    setUser(props.user);
    setMessages(props.messages.data);
    setPaginate(props.messages);
  }, []);

  const value = {
    ...state,
    user: isFirstLoading ? props.user : state.user,
    showSidebarRight: localStorage.getItem("toggle-sidebar-right") === "true",
    messages: isFirstLoading ? props.messages.data : state.messages,
    paginate: props.paginate ? props.messages : state.paginate,
    setMessages,
    setPaginate,
    setUser,
    toggleSidebarRight,
  };

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};
