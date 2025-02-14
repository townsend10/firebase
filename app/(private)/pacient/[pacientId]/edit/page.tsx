import { Pacient } from "@/types";
import { PacientEdit } from "./_components/pacient-edit";

const PacientEditPage = () => {
  const pacient: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };
  return (
    <div className="flex flex-grow">
      <PacientEdit pacient={pacient} />
    </div>
  );
};

export default PacientEditPage;
