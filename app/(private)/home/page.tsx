"use client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { HomePrivate } from "./_components/home-private";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";

const PrivateHomePage = () => {
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-grow">
      <HomePrivate />
    </div>
  );
};

export default PrivateHomePage;
