"use client";
import { getCurrentUser } from "@/actions/get-user";
import { useAction } from "@/hooks/use-action";
import { useAuth } from "@/hooks/use-current-user";
import { getAuth, signOut } from "firebase/auth";
import {
  Contact,
  Gamepad2Icon,
  Home,
  MedalIcon,
  User2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOutButton } from "./log-out-button";
import { Separator } from "./ui/separator";
import { UserProfile } from "./user-profile";

export const Header = () => {
  const [picture, setPicture] = useState<null | string>("");
  const [initial, setInitial] = useState<string | undefined>("");
  const [phone, setPhone] = useState("");

  const [googleName, setGoogleName] = useState<string | null | undefined>("");
  const [googlePhone, setGooglePhone] = useState<string | null | undefined>("");

  const [image, setImage] = useState("");
  const [googleImage, setGoogleImage] = useState<string | null | undefined>("");
  const [name, setName] = useState("");
  const paramas = useParams();
  const [id, setId] = useState("");
  const auth = getAuth();
  const userId = auth.currentUser;

  const { isLoggedIn, user } = useAuth();

  const { data, execute: getUser } = useAction(getCurrentUser, {
    onSuccess: (data: any) => {
      toast.success(`ola ${data.name}`);

      setName(data.name);
      setGoogleName(auth.currentUser?.displayName);

      setPhone(data.phone);
      setGooglePhone(auth.currentUser?.phoneNumber);
      setImage(data.imageUrl);
      setGoogleImage(auth.currentUser?.photoURL);
    },
    onError: (error) => {
      // toast.error(error);
    },
  });

  // if (!userId) {
  //   return null;
  // }

  useEffect(() => {
    getUser({
      // id: `${paramas.userId}`,
      // id: userId?.uid as string,
      id: auth.currentUser?.uid as string,

      name: "",
      phone: "",
    });
  }, [userId]);

  const router = isLoggedIn
    ? [
        {
          href: "/",
          label: "Pagina Inicial",
          icon: <Home className="h-4 w-4" />,
        },
        {
          href: "/profile",
          label: "Profile",
          icon: <User2 className="h-4 w-4" />,
        },
        {
          href: "/medicalCare",
          label: "Consulta Medica",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        {
          href: "/pacient",
          label: "Lista de Pacientes",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        {
          href: "/users",
          label: "Usuarios",
          icon: <User2 className="h-4 w-4" />,
        },
        {
          href: "/schedules",
          label: "Agendamentos",
          icon: <Contact className="h-4 w-4" />,
        },
        {
          href: "/games",
          label: "Games",
          icon: <Gamepad2Icon className="h-4 w-4" />,
        },
      ]
    : [
        {
          href: "/",
          label: "Pagina Inicial",
          icon: <Home className="h-4 w-4" />,
        },

        {
          href: "/login",
          label: "Login",
          icon: <UserCog className="h-4 w-4" />,
        },
        {
          href: "/register",
          label: "Cadastro",
          icon: <Home className="h-4 w-4" />,
        },
      ];

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Usuário deslogado com sucesso");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white h-screen w-full max-w-sm  overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-yellow-300">Firebase</h1>
        <LogOutButton />
      </div>
      <Separator />
      <div className="flex-grow overflow-y-auto">
        {router.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className="flex items-center my-2 px-4 py-2 hover:bg-gray-700"
          >
            {route.icon}
            <div className="ml-2">{route.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-start p-4">
        {isLoggedIn ? (
          <div>
            <UserProfile
              firstName={googleName}
              logout={logout}
              picture={image}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
