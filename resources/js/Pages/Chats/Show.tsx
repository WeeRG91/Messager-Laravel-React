import AppLayout from '@/Layouts/AppLayout'
import { ChatProvider } from "@/Contexts/chat-context";
import { ModalProvider } from "@/Contexts/modal-context";
import SidebarMini from "@/Layouts/Partials/SidebarMini";
import Sidebar from "@/Components/Chats/Sidebar";
import Content from "@/Components/Chats/Content";
import SidebarRight from "@/Components/Chats/SidebarRight";
import { ChatMessageProvider } from "@/Contexts/chat-message-context";

export default function Show({}) {
    return (
      <AppLayout title="Chats">
        <ChatProvider>
          <ChatMessageProvider>
            <ModalProvider>
              <SidebarMini />
              <Sidebar />

              <Content />
              <SidebarRight />
            </ModalProvider>
          </ChatMessageProvider>
        </ChatProvider>
      </AppLayout>
    );
}
