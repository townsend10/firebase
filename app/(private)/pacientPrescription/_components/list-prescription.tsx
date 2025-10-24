"use client";

import { getPrescriptions } from "@/actions/get-prescriptions";
import { getSchedules } from "@/actions/get-schedules";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ListPacientProps {
  id: string;
  content: string;
  name: string;
}


export const ListPrescription = ({ content, id, name }: ListPacientProps) => {
  const router = useRouter();

  const { data, execute: allPrescriptions } = useAction(getPrescriptions, {
    onSuccess: (data) => {
      // toast.success(`sucesso ao recuperar o paciente `);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    // Retorna uma função de limpeza para cancelar a inscrição quando o componente for desmontado
    allPrescriptions({
      id: id,
      content: content,
      name: name,
    });
  }, [allPrescriptions, id, content, name]);



  return (
    <div className="flex flex-col mt-5 space-y-4 min-h-screen ml-5 p-4 max-w-lg">
  
  <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Lista de Pacientes</h1>
  
  {/* Verifica se há dados antes de mapear */}
  {data?.length === 0 && <p className="text-gray-500">Nenhuma receita encontrada.</p>}

  <ul className="space-y-3">
    {data?.map((prescriptions: DocumentData) => (
      
      // Lista de item: Alinha o nome à esquerda e o botão à direita
      <li 
        key={prescriptions.id} 
        className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition duration-150"
      >
        {/* Nome do Paciente: Texto mais destacado e que ocupa o espaço à esquerda */}
        <p className="text-lg font-semibold text-gray-700">
          {prescriptions.name}
        </p>

        {/* Botão de Ação */}
        <Button
          onClick={() =>
            router.push(`/pacientPrescription/${prescriptions.id}`)
          }
          variant={"ghost"}
          className="text-blue-600 hover:bg-blue-50"
        >
          Atestado
        </Button>
      </li>
    ))}
  </ul>
</div>
  );
};
