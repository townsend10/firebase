'use client'
import { getAuth } from "firebase/auth";
import { Scheduling } from "./_components/scheduling";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { useRouter } from "next/navigation";

const PageSchedule = () => {
    const { currentUser } = getAuth(firebaseApp);
  
    const router = useRouter();
  
    if (!currentUser) {
      router.push("/");
    }
  
  return (
    <div className="flex flex-grow">
      <Scheduling />
    </div>
  );
};

export default PageSchedule;
