"use client";
import { getAuth } from "firebase/auth";
import { HomePublic } from "./_components/home-public";
import { firebaseApp } from "../api/firebase/firebase-connect";
import { useRouter } from "next/navigation";

export default function Page() {
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/home");
  }

  return (
    <div className="flex flex-grow">
      <HomePublic />
    </div>
  );
}
