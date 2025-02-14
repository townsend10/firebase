"use client";
import { useAuth } from "@/hooks/use-current-user";
import { Pacient } from "@/types";
import { ListPacient } from "./_components/list-pacients";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const PagePacient = () => {
  const pacients: Pacient = {
    birthdayDate: "",
    cpf: "",
    email: "",
    name: "",
    phone: "",
    id: "",
  };
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  if (!isLoggedIn) {
    return (
      <div className="flex  flex-col items-center justify-center w-full">
        <p className="font-semibold">
          Usuário desconectado, por favor clique
          <Button
            variant="ghost"
            className=" font-semibold"
            onClick={() => router.push("/login")}
          >
            aqui
          </Button>
          aqui para continuaar!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-grow">
      <ListPacient pacient={pacients} />
    </div>
  );
};

export default PagePacient;
