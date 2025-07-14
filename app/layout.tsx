import { HeaderMobile } from "@/components/heade-mobile";
import { AuthProvider } from "@/components/provider/auth-context";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Firebase",
  description: "Apple Firebasee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex ">
                <SidebarTrigger />

                <Toaster />
                <div className="flex ">
                  <div className="sm:hidden">
                    <HeaderMobile />
                  </div>
                  <div className="hidden p-0 sm:block">
                    {/* <Header /> */}
                    {/* <AppSidebar /> */}
                  </div>
                  {/* <div className="flex-grow flex flex-col ">{children}</div> */}
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
