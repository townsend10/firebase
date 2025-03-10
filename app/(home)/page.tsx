"use client";
import { Header } from "@/components/header";
import { InitalPage } from "@/components/inital-page";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { currentUser } = getAuth();

  if (!currentUser) {
    router.replace("/login");
  }
  return (
    <div className="flex items-center justify-center">
      <InitalPage />

      {/* {currentUser?.email} */}
    </div>
  );
}
