"use client";
import { useRouter } from "next/navigation";

export const HomePublic = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl space-y-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Novo Sistema v2.0
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Gestão Médica <span className="text-primary">Simples</span> e{" "}
            <span className="text-blue-600">Eficiente</span>
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-500 md:text-2xl dark:text-gray-400">
            Otimize o atendimento da sua clínica com nossa plataforma completa
            de agendamento e gestão de pacientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10"
            >
              Começar Agora
            </button>
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-14 px-10"
            >
              Acessar Conta
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm border">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Agendamento Online</h3>
              <p className="text-muted-foreground">
                Permita que seus pacientes agendem consultas 24/7 de qualquer
                lugar.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm border">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Gestão Rápida</h3>
              <p className="text-muted-foreground">
                Acesse prontuários e histórico de pacientes em segundos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm border">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
              <p className="text-muted-foreground">
                Seus dados protegidos com a mais alta tecnologia de
                criptografia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <p>© 2024 Clínica Saúde+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
