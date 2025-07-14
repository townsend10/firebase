"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomePrivate = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center min-h-screen items-center  p-4">
      <div className=" text-center  rounded-xl shadow-lg p-10 border border-gray-200">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
          🏥 Clínica Saúde+
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          O melhor sistema para agendamento de consultas médicas.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div
            className="bg-blue-50 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => router.push("/medicalCare")}
          >
            <h2 className="text-lg font-bold text-blue-600">📅 Agendar</h2>
            <p className="text-gray-600 mt-2">
              Agende suas consultas de forma rápida e prática.
            </p>
          </div>

          <div
            className="bg-green-50 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => router.push("/pacient")}
          >
            <h2 className="text-lg font-bold text-green-600">⏰ Horários</h2>
            <p className="text-gray-600 mt-2">
              Veja seus horários de consulta, altere ou cancele a qualquer hora.
            </p>
          </div>

          <div
            className="bg-yellow-50 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <h2 className="text-lg font-bold text-yellow-600">
              👩‍⚕️ Profissionais
            </h2>
            <p className="text-gray-600 mt-2">
              Atendimento com os melhores médicos e especialistas.
            </p>
          </div>
        </div>

        <button className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          Comece Agora 🚀
        </button>
      </div>
    </div>
    // <div className="flex flex-col justify-center items-center p-4 min-h-screen ">
    //   <h1 className="text-center bg-white rounded-xl shadow-lg p-10 border ">
    //     🏥 Clínica Saúde+
    //   </h1>
    //   <p className="text-xl text-gray-700 font-medium">
    //     O melhor sistema para agendamento de consultas médicas.
    //   </p>
    //   <div>
    //     <p>📅 Agendar Agende suas consultas de forma rápida e prática.</p>
    //   </div>
    //   <div>
    //     ⏰ Horários Veja seus horários de consulta, altere ou cancele a qualquer
    //     hora.
    //   </div>
    //   <div>
    //     <p>
    //       👩‍⚕️ Profissionais Atendimento com os melhores médicos e especialistas.
    //     </p>
    //   </div>

    //   <Button>Começar</Button>
    // </div>
  );
};
