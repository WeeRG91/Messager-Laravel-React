import { Chat, ChatPaginate } from "@/types/chat";
import { InitialPaginate } from "@/types/paginate";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "@/types";

type State = {
  chats: Chat[];
  paginate: ChatPaginate;
  setChats: (value: Chat[]) => void;
  setPaginate: (value: ChatPaginate) => void;
  refreshChats: () => void;
};

type Action =
  | {
      type: "SET_CHATS";
      payload: Chat[];
    }
  | {
      type: "SET_PAGINATE";
      payload: ChatPaginate;
    };

const initialState: State = {
  chats: [],
  paginate: InitialPaginate,
  setChats: () => {},
  setPaginate: () => {},
  refreshChats: () => {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload,
      };
    case "SET_PAGINATE":
      return {
        ...state,
        paginate: action.payload,
      };
  }
};

const ChatContext = createContext<State>(initialState);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<ChatPageProps>().props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const setChats = (value: Chat[]) => {
    dispatch({ type: "SET_CHATS", payload: value });
  };
  const setPaginate = (value: ChatPaginate) => {
    dispatch({ type: "SET_PAGINATE", payload: value });
  };

  useEffect(() => {
    setIsFirstLoading(false)
    setChats(props.chats.data)
    setPaginate(props.chats)
  }, []);

  const value = {
    ...state,
    chats: isFirstLoading ? props.chats.data : state.chats,
    paginate: props.paginate ? props.chats : state.paginate,
    setChats,
    setPaginate,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};
