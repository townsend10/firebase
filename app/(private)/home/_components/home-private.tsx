"use client";

import Link from "next/link";
import { Calendar, Users, Settings } from "lucide-react";

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: typeof Calendar;
  accent: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    href: "/schedules",
    label: "Agendamentos",
    description: "Visualize e gerencie sua agenda de consultas diária.",
    icon: Calendar,
    accent: "blue",
  },
  {
    href: "/users",
    label: "Pacientes",
    description: "Acesse a lista completa de pacientes e seus prontuários.",
    icon: Users,
    accent: "green",
  },
  {
    href: "/profile",
    label: "Configurações",
    description: "Gerencie seu perfil e preferências do sistema.",
    icon: Settings,
    accent: "yellow",
  },
];

const ACCENT_MAP: Record<string, { bg: string; text: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
  },
};

export const HomePrivate = () => {
  return (
    <div className="w-full min-h-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center bg-gradient-to-b mt-10 from-background to-muted/20 rounded-b-3xl">
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
            {QUICK_LINKS.map((link) => {
              const colors = ACCENT_MAP[link.accent];
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col items-center text-center p-8 bg-card rounded-xl shadow-sm border hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div
                    className={`p-4 ${colors.bg} rounded-full mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`size-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{link.label}</h3>
                  <p className="text-muted-foreground">{link.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
