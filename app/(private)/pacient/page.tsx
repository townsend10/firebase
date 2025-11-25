"use client";
import { ListPacient } from "./_components/list-pacients";

// Force dynamic rendering for real-time patient data
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PagePacient = () => {
  // Empty initial patient data - the component will fetch real data
  const emptyPacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };

  return <ListPacient pacient={emptyPacient} />;
};

export default PagePacient;
