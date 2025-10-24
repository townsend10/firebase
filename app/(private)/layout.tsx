import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Toaster } from "sonner";

const LayoutPrivate = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />

      <main className="flex flex-grow  min-h-screen">
        <div className="flex flex-grow">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default LayoutPrivate;
