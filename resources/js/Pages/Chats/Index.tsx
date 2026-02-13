import AppLayout from "@/Layouts/AppLayout";
import SidebarMini from "@/Layouts/Partials/SidebarMini";
import Sidebar from "@/Components/Chats/Sidebar";
import ContentEmpty from "@/Components/Chats/ContentEmpty";
import { ModalProvider } from "@/Contexts/modal-context";

export default function Index({}) {
  return (
    <AppLayout title="Chats">
      <ModalProvider>
        <SidebarMini />
        <Sidebar />
        <ContentEmpty />
      </ModalProvider>
    </AppLayout>
  );
}
