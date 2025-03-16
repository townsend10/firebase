export const InitalPage = () => {
  return (
    // <div className=" flex  flex-col max-w-3xl mx-auto p-6   mt-5 ">
    //   <h1 className="font-bold text-red-600 text-4xl text-center">
    //     Meu primeiro curso de Firebase
    //   </h1>
    //   <h1 className="pb-5 font-bold  text-lg mt-2">O que é?</h1>
    //   <p className="mr-20">
    //     O Firebase é uma plataforma de desenvolvimento de aplicativos da Google
    //     que fornece serviços em nuvem, incluindo armazenamento de dados em tempo
    //     real, autenticação de usuários, hospedagem de conteúdo, mensagens em
    //     nuvem, e outras ferramentas para facilitar o desenvolvimento e
    //     aprimoramento de aplicativos web e móveis. Ele oferece uma variedade de
    //     recursos prontos para uso, permitindo que os desenvolvedores construam e
    //     dimensionem aplicativos de maneira eficiente.
    //   </p>
    //   <div className=" mt-2">
    //     <h1 className="font-bold ">Vantagens</h1>

    //     <ul className="list-disc list-inside pt-5">
    //       <li>Integração simples</li>
    //       <li>Armazenamento em nuvem em tempo real</li>
    //       <li>Autenticação segura</li>
    //       <li>Hospedagem web</li>
    //       <li>Mensagem em Nuvem</li>
    //       <li>Desenvolvimento rápido</li>
    //     </ul>
    //   </div>
    //   <div className="mt-2">
    //     <h1 className="font-bold">Desvantagens</h1>

    //     <ul className="list-disc list-inside pt-5">
    //       <li>Custo</li>
    //       <li>Flexibilidade Limitada do Banco de Dados</li>
    //       <li>Tamanho do aplicativo</li>
    //       <li>Personalizaçao limitada</li>
    //       <li>Limitações em alguns recursos</li>
    //     </ul>
    //   </div>
    // </div>

    // <div className="flex flex-grow justify-center items-center min-h-screen bg-gray-100 p-4">
    //   <div className="w-full max-w-3xl text-center bg-white rounded-xl shadow-lg p-10 border border-gray-200">
    //     <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
    //       🏥 Clínica Saúde+
    //     </h1>
    //     <p className="text-xl text-gray-700 font-medium">
    //       O melhor sistema para agendamento de consultas médicas.
    //     </p>

    //     <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    //       <div className="bg-blue-50 p-4 rounded-lg shadow-md">
    //         <h2 className="text-lg font-bold text-blue-600">📅 Agendamentos</h2>
    //         <p className="text-gray-600 mt-2">
    //           Agende suas consultas de forma rápida e prática.
    //         </p>
    //       </div>

    //       <div className="bg-green-50 p-4 rounded-lg shadow-md">
    //         <h2 className="text-lg font-bold text-green-600">⏰ Horários</h2>
    //         <p className="text-gray-600 mt-2">
    //           Veja horários disponíveis e escolha o melhor para você.
    //         </p>
    //       </div>

    //       <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
    //         <h2 className="text-lg font-bold text-yellow-600">
    //           👩‍⚕️ Profissionais
    //         </h2>
    //         <p className="text-gray-600 mt-2">
    //           Atendimento com os melhores médicos e especialistas.
    //         </p>
    //       </div>
    //     </div>

    //     <button className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
    //       Comece Agora 🚀
    //     </button>
    //   </div>
    // </div>

    <div className="flex flex-grow justify-center items-center min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-3xl text-center bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-10 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 mb-2 sm:mb-4">
          🏥 Clínica Saúde+
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 font-medium">
          O melhor sistema para agendamento de consultas médicas.
        </p>

        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-md">
            <h2 className="text-base sm:text-lg font-bold text-blue-600">
              📅 Agendamentos
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Agende suas consultas de forma rápida e prática.
            </p>
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg shadow-md">
            <h2 className="text-base sm:text-lg font-bold text-green-600">
              ⏰ Horários
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Veja horários disponíveis e escolha o melhor para você.
            </p>
          </div>

          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg shadow-md">
            <h2 className="text-base sm:text-lg font-bold text-yellow-600">
              👩‍⚕️ Profissionais
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Atendimento com os melhores médicos e especialistas.
            </p>
          </div>
        </div>

        <button className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          Comece Agora 🚀
        </button>
      </div>
    </div>
  );
};
