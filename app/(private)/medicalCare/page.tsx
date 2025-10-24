"use client";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { MedicForm } from "./_components/medic-form";

const MedicalCarePage = () => {
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex flex-grow">
      <MedicForm />
    </div>
  );
};

export default MedicalCarePage;
