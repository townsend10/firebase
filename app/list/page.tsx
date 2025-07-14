import { Pacient } from "@/types";
import { ListPacient } from "./_components/list-pacient";

const ListPage = () => {
  const pacients: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };
  return (
    <div className=" ">
      <ListPacient pacient={pacients} />
    </div>
  );
};

export default ListPage;
