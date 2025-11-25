"use client";

import { useRouter } from "next/navigation";

export const HomePrivate = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full min-h-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center bg-gradient-to-b from-background to-muted/20 rounded-b-3xl">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
            Painel Administrativo
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Bem-vindo ao <span className="text-blue-600">Saúde+</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Gerencie sua clínica, pacientes e agendamentos em um só lugar com
            eficiência e rapidez.
          </p>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-muted-foreground">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              onClick={() => router.push("/medicalCare")}
              className="group flex flex-col items-center text-center p-8 bg-card rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Agendamentos</h3>
              <p className="text-muted-foreground">
                Visualize e gerencie sua agenda de consultas diária.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => router.push("/pacient")}
              className="group flex flex-col items-center text-center p-8 bg-card rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Pacientes</h3>
              <p className="text-muted-foreground">
                Acesse a lista completa de pacientes e seus prontuários.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => router.push("/profile")}
              className="group flex flex-col items-center text-center p-8 bg-card rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Configurações</h3>
              <p className="text-muted-foreground">
                Gerencie seu perfil e preferências do sistema.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
