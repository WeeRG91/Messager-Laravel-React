import AppLayout from "@/Layouts/AppLayout";
import SidebarMini from "@/Layouts/Partials/SidebarMini";
import Sidebar from "@/Components/Chats/Sidebar";
import ContentEmpty from "@/Components/Chats/ContentEmpty";

export default function Index({}) {
    return (
        <AppLayout title="Chats">
          <SidebarMini />
          <Sidebar />
          <ContentEmpty />
        </AppLayout>
    )
}
