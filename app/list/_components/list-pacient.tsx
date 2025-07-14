"use client";
import { getPacient } from "@/actions/get-pacient.tsx";
import { getPacients } from "@/actions/get-pacients";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { Pacient } from "@/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
interface ListPacientProps {
  pacient: Pacient;
}
export const ListPacient = ({ pacient }: ListPacientProps) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const { data, execute: allPatients } = useAction(getPacients, {
    onSuccess: (data) => {
      // toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  const { data: getOnePacient, execute: LoadPacient } = useAction(getPacient, {
    onSuccess: (data) => {
      toast.success(`${data.name} bem vindo   `);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/login");
    },
  });

  useEffect(() => {
    // Retorna uma função de limpeza para cancelar a inscrição quando o componente for desmontado
    allPatients({
      birthdayDate: pacient.birthdayDate,
      cpf: pacient.cpf,
      email: pacient.email,
      name: pacient.name,
      phone: pacient.phone,
      id: pacient.id,
    });
  }, [
    allPatients,
    pacient.birthdayDate,
    pacient.name,
    pacient.cpf,
    pacient.email,
    pacient.phone,
    pacient.id,
  ]);

  const filteredPacients = data?.filter(
    (pacient) => pacient.name.toLowerCase().includes(name.toLowerCase())
    // pacient.email.toLowerCase().includes(name.toLowerCase()) ||
    // pacient.phone.includes(name) // Phone search can be exact or partial
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const hasTyped = name.trim() !== "";

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //   {" "}
    //   {/* Centering container */}
    //   <div className="flex flex-col items-center p-6 dark:bg-gray-900   rounded-lg shadow-md max-w-sm w-full">
    //     {" "}
    //     {/* Card-like container for content */}
    //     <h1 className="text-3xl font-bold mb-6 text-center">Chamar Paciente</h1>
    //     <div className="w-full">
    //       {" "}
    //       {/* Ensures inner content takes full width */}
    //       <label
    //         htmlFor="patientNameInput"
    //         className="block text-lg font-semibold mb-2 text-gray-700"
    //       >
    //         Digite o nome do paciente:
    //       </label>
    //       <Input
    //         id="patientNameInput"
    //         type="text"
    //         value={name}
    //         onChange={handleInputChange}
    //         placeholder="Nome do paciente"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" // Input styling
    //       />
    //       {name && (
    //         <p className="mt-4 text-center text-gray-600">
    //           Você digitou:{" "}
    //           <span className="font-semibold text-blue-700">{name}</span>
    //         </p>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col min-h-screen  ">
      <h1 className="mt-10 ml-5 text-5xl  font-bold">Chamar paciente</h1>

      <div className="flex items-center justify-center">
        <Input
          id="patientNameInput"
          type="text"
          value={name}
          onChange={handleInputChange}
          placeholder="Nome do paciente"
          className="max-w-lg  px-3 py-2 border mt-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" // Input styling
        />
      </div>
      <div className="flex  items-center justify-center  text-5xl mt-[300px] ">
        {/* <p>Paciente: {name}</p> */}

        <div>
          {hasTyped && (
            <div>
              {filteredPacients && filteredPacients.length > 0 ? (
                filteredPacients.map((pacient) => {
                  return (
                    <div
                      className="ml-5 mb-4 p-4 border rounded-lg shadow-sm bg-white"
                      key={pacient.id}
                    >
                      <h2 className="text-center text-5xl text-gray-500   ">
                        Nome : {pacient.name}{" "}
                      </h2>

                      {/* Action Buttons */}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 mt-8 text-5xl">
                  Nenhum paciente encontrado.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
