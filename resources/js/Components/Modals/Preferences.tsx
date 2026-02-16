import { useAppContext } from "@/Contexts/app-context";
import { useModalContext } from "@/Contexts/modal-context";
import Modal from "@/Components/Modals/Modal";
import { Fragment } from "react";
import { BsAppIndicator, BsChevronDown, BsCircleHalf } from "react-icons/bs";
import Dropdown from "@/Components/Dropdown";
import { Switch } from "@headlessui/react";
import { updateUser } from "@/Api/user";

export default function Preferences() {
  const { theme, auth, setTheme, setAuth } = useAppContext();
  const { closeModal } = useModalContext();

  const toggleActiveStatus = (status: boolean) => {
    console.log(status);
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
    });
  };

  return (
    <Modal>
      <Modal.Header title="Preferences" onClose={closeModal} />

      <Modal.Body className="flex" as={Fragment}>
        <div className="flex justify-between">
          <div className="textsm flex items-center gap-2">
            <BsCircleHalf />
            Theme
          </div>
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                <BsChevronDown />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Button onClick={() => setTheme("system")}>
                System
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("dark")}>
                Dark
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("light")}>
                Light
              </Dropdown.Button>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex justify-between">
          <div className="textsm flex items-center gap-2">
            <BsAppIndicator />
            Active Status
          </div>

          <Switch
            checked={auth.active_status}
            onChange={() => toggleActiveStatus(!auth.active_status)}
            className={`${auth.active_status ? "bg-primary-default" : "bg-secondary-default"} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable active status</span>
            <span
              className={`${auth.active_status ? "translate-x-6" : "translate-x-1"} inline-flex h-4 w-4 transform rounded-full bg-background transition`}
            />
          </Switch>
        </div>
      </Modal.Body>
    </Modal>
  );
}
