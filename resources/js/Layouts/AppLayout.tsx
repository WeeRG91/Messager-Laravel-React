import { PropsWithChildren } from "react";
import { Head } from "@inertiajs/react";
import { AppProvider } from "@/Contexts/app-context";

export default function AppLayout({title, children}: PropsWithChildren<{title: string}>) {
  return (
    <AppProvider>
      <Head title={title} />

      <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground sm:flex-row">
        {children}
      </div>
    </AppProvider>
  )
}
