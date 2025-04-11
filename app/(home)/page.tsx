"use client";
import { InitalPage } from "@/components/inital-page";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { currentUser } = getAuth();

  if (!currentUser) {
    router.replace("/login");
  }

  return null;
}
