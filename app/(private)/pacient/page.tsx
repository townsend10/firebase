import { Pacient } from "@/types";
import { ListPacient } from "./_components/list-pacients";
const PagePacient = () => {
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
      <ListPacient pacient={pacients} />
    </div>
  );
};

export default PagePacient;
