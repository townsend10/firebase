"use client";
import { Pacient } from "@/types";
import { useRouter } from "next/navigation";
import { ScheduleList } from "./schedule-list";

// Force dynamic rendering for real-time schedule data
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SchedulePage = () => {
  const router = useRouter();

  const pacients: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };

  return (
    <div className="flex flex-grow">
      <ScheduleList pacientMedicData={pacients} />
    </div>
  );
};

export default SchedulePage;
