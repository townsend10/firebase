// export const Header = ({ children }: { children: React.ReactNode }) => {
//   return <div>{children}</div>;
// };

import { Home, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOutButton } from "./log-out-button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

export const Header = () => {
  const router = [
    {
      href: "/",
      label: "Pagina Inicial",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/login",
      label: "Login",
      icon: <User className="h-4 w-4" />,
    },
    {
      href: "/register",
      label: "Cadastro",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/medicalCare",
      label: "Consulta Medica",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/pacient",
      label: "Lista de Pacientes",
      icon: <Home className="h-4 w-4" />,
    },
  ];
  return (
    <div className="flex flex-col w-10/12 scroll-mb-0  bg-gray-900 text-white">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold my-4 text-yellow-300">Firebase</h1>
        <LogOutButton />
      </div>
      <Separator />
      <div className="flex-grow overflow-y-auto">
        {router.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-700">
            {route.icon}
            <div className="ml-2">{route.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
