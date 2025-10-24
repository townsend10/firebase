import { HeaderMobile } from "@/components/heade-mobile";
import { AuthProvider } from "@/components/provider/auth-context";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
// import "./globals.css";
import "./globals.css";
import { Header } from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle";

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
            <main className="flex flex-grow  min-h-screen">
              <Toaster />
              <div className="flex "></div>
              <div className="flex flex-grow">{children}</div>
              <ModeToggle />
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
