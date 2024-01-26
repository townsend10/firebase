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
    <div>
      <ListPacient Pacients={Pacients} />
    </div>
  );
};

export default PagePacient;
