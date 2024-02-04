import { Pacient } from "@/types";
import { ListPacient } from "./_components/list-pacients";
const PagePacient = () => {
  const Pacients: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
  };
  return (
    <div className="flex flex-grow">
      <ListPacient Pacients={Pacients} />
    </div>
  );
};

export default PagePacient;
