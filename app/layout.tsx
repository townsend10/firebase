import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { InitalPage } from "@/components/inital-page";
import { Header } from "@/components/header";
import { AuthProvider } from "@/components/provider/auth-context";

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
          <div className="flex">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
