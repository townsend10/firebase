"use client";
import { useRouter } from "next/navigation";

export const HomePublic = () => {
  const router = useRouter();
  return (
    // <div className="flex flex-col justify-center items-center min-h-screen p-4">

    //   {/* Seção do cabeçalho */}
    //   <div className="text-center mb-6">
    //     <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-700">
    //       <UserIcon className="inline-block w-8 h-8 md:w-10 md:h-10 mr-2" />
    //       Clínica Médica
    //     </h1>
    //     <p className="mt-2 text-base md:text-lg text-gray-600">
    //       Aqui você encontra diversos serviços médicos, como agendamentos,
    //       horários, etc.
    //     </p>
    //   </div>

    //   {/* Botões de Ação */}
    //   <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
    //     <Button variant="outline" className="flex items-center justify-center gap-2 flex-1 py-3 px-6 text-lg font-semibold">
    //       <CalendarIcon className="w-5 h-5" />
    //       Agendar Consulta
    //     </Button>
    //     <Button className="flex items-center justify-center gap-2 flex-1 py-3 px-6 text-lg font-semibold">
    //       <LogInIcon className="w-5 h-5" />
    //       Entrar
    //     </Button>
    //   </div>

    //   {/* Links Adicionais */}
    //   <div className="mt-8 text-center">
    //     <p className="text-sm text-gray-500">
    //       Novo por aqui?
    //       <a href="#" className="text-blue-500 hover:underline ml-1">
    //         Crie sua conta.
    //       </a>
    //     </p>
    //   </div>

    // </div>
    <div className="flex flex-col justify-center min-h-screen items-center  p-4">
      <div className=" text-center  rounded-xl shadow-lg p-10 border border-gray-200">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
          🏥 Clínica Saúde+
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          O melhor sistema para agendamento de consultas médicas.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div className="bg-blue-50 p-4 rounded-lg shadow-md cursor-pointer">
            <h2 className="text-lg font-bold text-blue-600">📅 Agendar</h2>
            <p className="text-gray-600 mt-2">
              Agende suas consultas de forma rápida e prática.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-md cursor-pointer">
            <h2 className="text-lg font-bold text-green-600">⏰ Horários</h2>
            <p className="text-gray-600 mt-2">
              Veja seus horários de consulta, altere ou cancele a qualquer hora.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow-md cursor-pointer">
            <h2 className="text-lg font-bold text-yellow-600">
              👩‍⚕️ Profissionais
            </h2>
            <p className="text-gray-600 mt-2">
              Atendimento com os melhores médicos e especialistas.
            </p>
          </div>
        </div>

        <button
          className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={() => router.push("/register")}
        >
          Comece Agora 🚀
        </button>
        <p className="pt-2 text-muted-foreground">
          Ja possui uma conta? Clique{" "}
          <a href="/login" className="text-blue-500 underline">
            aqui
          </a>
        </p>
      </div>
    </div>
  );
};
