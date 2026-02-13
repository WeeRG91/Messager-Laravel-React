import { User } from "@/types/user";
import {
  createContext,
  PropsWithChildren,
  Reducer,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

type State = {
  theme: string;
  auth: User;
  setTheme: (value: string) => void;
  setAuth: (value: User) => void;
};

type Action =
  | {
      type: "SET_THEME";
      payload: string;
    }
  | {
      type: "SET_AUTH";
      payload: User;
    };

const initialState: State = {
  theme: localStorage.getItem("theme") || "system",
  auth: {
    id: "",
    name: "",
    email: "",
    email_verified_at: "",
    avatar: "",
    active_status: true,
    is_online: false,
    last_seen: "",
  },
  setTheme: () => {},
  setAuth: () => {},
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_THEME":
      const theme = action.payload;
      const html = document.documentElement;

      console.log(html)

      if (html) {
        html.classList.remove("dark");
        html.classList.remove("light");
      }

      switch (theme) {
        case "system":
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? html.classList.add("dark")
            : html.classList.remove("light");
          break;
        case "dark":
          html.classList.add("dark");
          break;
        case "light":
          html.classList.add("light");
          break;
      }

      localStorage.setItem("theme", theme);

      return {
        ...state,
        theme: theme,
      };
    case "SET_AUTH":
      return {
        ...state,
        auth: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<State>(initialState);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<PageProps>().props;
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState,
  );
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const setTheme = (value: string) =>
    dispatch({ type: "SET_THEME", payload: value });

  const setAuth = (value: User) =>
    dispatch({ type: "SET_AUTH", payload: value });

  useEffect(() => {
    setAuth(props.auth.user);
    setIsFirstLoading(false);
  }, []);

  const value = {
    ...state,
    theme: localStorage.getItem("theme") || "system",
    auth: isFirstLoading ? props.auth.user : state.auth,
    setTheme: setTheme,
    setAuth: setAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
