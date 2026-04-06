"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const LayoutPrivate = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen flex-col flex-grow bg-background">
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 h-10">
          <SidebarTrigger className="size-7" />
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default LayoutPrivate;
