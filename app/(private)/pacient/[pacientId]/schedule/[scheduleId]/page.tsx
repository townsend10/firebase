"use client";

import { getAuth } from "firebase/auth";
import { ScheduleInfo } from "../_components/schedule-info";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { useRouter } from "next/navigation";

const ScheduleIdPage = () => {
  const { currentUser } = getAuth(firebaseApp);
  const router = useRouter();

  if (!currentUser) {
    router.push("/");
  }

  return <ScheduleInfo />;
};

export default ScheduleIdPage;
