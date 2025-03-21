import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { InitalPage } from "@/components/inital-page";
import { Header } from "@/components/header";
import { AuthProvider } from "@/components/provider/auth-context";
import { HeaderMobile } from "@/components/heade-mobile";

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
        <AuthProvider>
          <Toaster />
          <div className="flex ">
            <div className="sm:hidden">
              <HeaderMobile />
            </div>
            <div className="hidden p-0 sm:block">
              <Header />
            </div>
            <div className="flex-grow flex flex-col ">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
