"use client";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { ScheduleEdit } from "../_components/schedule-edit";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

const SchedulePageEdit = () => {
  const { currentUser } = getAuth(firebaseApp);

  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return (
    <div className="flex w-full justify-center ">
      <ScheduleEdit />
    </div>
  );
};

export default SchedulePageEdit;
