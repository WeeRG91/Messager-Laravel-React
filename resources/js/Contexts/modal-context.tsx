import {
  createContext,
  PropsWithChildren,
  Reducer,
  useContext,
  useReducer,
} from "react";
import Modal from "@/Components/Modal";
import Preferences from "@/Components/Modals/Preferences";

type ModalViews = "PREFERENCE";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl";

type OpenModal<T = any> = {
  view: ModalViews;
  size?: ModalSize;
  payload?: T;
};

type State<T = any> = {
  view?: ModalViews;
  size?: ModalSize;
  data?: T;
  isOpen: boolean;
  openModal: <T>({ view, size, payload }: OpenModal<T>) => void;
  closeModal: () => void;
};

type Action<T = any> =
  | ({
      type: "OPEN";
    } & OpenModal<T>)
  | {
      type: "CLOSE";
    };

const initialState: State = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        view: action.view,
        size: action.size,
        data: action.payload,
        isOpen: true,
      };
    case "CLOSE":
      return {
        ...state,
        view: undefined,
        size: undefined,
        data: undefined,
        isOpen: false,
      };
    default:
      return state;
  }
};

const ModalContext = createContext<State>(initialState);

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const openModal = ({ view, size, payload }: OpenModal) =>
    dispatch({ type: "OPEN", view, size, payload });

  const closeModal = () => dispatch({ type: "CLOSE" });

  const value = {
    ...state,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalChildren />
    </ModalContext.Provider>
  );
};

export const ModalChildren = () => {
  const {isOpen, view, size, closeModal} = useModalContext();

  return (
    <Modal show={isOpen} onClose={closeModal} maxWidth={size}>
      {view === "PREFERENCE" && <Preferences />}
    </Modal>
  )
}
