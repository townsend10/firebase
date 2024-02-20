import { Pacient } from "@/types";
import { InfoPacient } from "../_components/info-pacinet";

const PacientIdPage = () => {
  const pacient: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };
  return (
    <div className="flex flex-grow min-h-screen">
      <InfoPacient pacient={pacient} />
    </div>
  );
};

export default PacientIdPage;
