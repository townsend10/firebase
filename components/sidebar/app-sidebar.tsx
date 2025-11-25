"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import {
  Calendar,
  Contact,
  Gamepad2Icon,
  Home,
  Inbox,
  ListIcon,
  MedalIcon,
  Search,
  Settings,
  SyringeIcon,
  User2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavUser } from "./nav-user";
import { UserProfile } from "../user-profile";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { getCurrentUser } from "@/actions/get-user";

export function AppSidebar() {
  const { isLoggedIn, user } = useAuth();
  const [phone, setPhone] = useState("");
  const [googleName, setGoogleName] = useState<string | null | undefined>("");
  const [googlePhone, setGooglePhone] = useState<string | null | undefined>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [image, setImage] = useState("");
  const [googleImage, setGoogleImage] = useState<string | null | undefined>("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser;

  const { data, execute: getUser } = useAction(getCurrentUser, {
    onSuccess: (data: any) => {
      // toast.success(`ola ${data.name}`);

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
  }, [userId, auth.currentUser?.uid, getUser]);

  const { logout: authLogout } = useAuth();

  const logout = async () => {
    await authLogout();
  };

  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const router = isLoggedIn
    ? [
        {
          href: "/home",
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
          label: "Agendar",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        {
          href: "/pacient",
          label: "Lista de Pacientes",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        // {
        //   href: "/users",
        //   label: "Usuarios",
        //   icon: <User2 className="h-4 w-4" />,
        // },
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
        {
          href: "/list",
          label: "Lista de Pacientes",
          icon: <ListIcon className="h-4 w-4" />,
        },
        {
          href: "/medicalPrescription",
          label: "Criar atestado",
          icon: <SyringeIcon className="h-4 w-4" />,
        },
        {
          href: "/pacientPrescription",
          label: "Atestados",
          icon: <SyringeIcon className="h-4 w-4" />,
        },
      ]
    : [
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

  //    <Sidebar collapsible="offcanvas" {...props}>
  //   <SidebarHeader>
  //     <SidebarMenu>
  //       <SidebarMenuItem>
  //         <SidebarMenuButton
  //           asChild
  //           className="data-[slot=sidebar-menu-button]:!p-1.5"
  //         >
  //           <a href="#">
  //             <IconInnerShadowTop className="!size-5" />
  //             <span className="text-base font-semibold">
  //               Clinic msdsdaedics
  //             </span>
  //           </a>
  //         </SidebarMenuButton>
  //       </SidebarMenuItem>
  //     </SidebarMenu>
  //   </SidebarHeader>
  //   <SidebarContent>
  //     <NavMain items={data.navMain} />
  //     {/* <NavDocuments items={data.documents} /> */}
  //     {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
  //   </SidebarContent>
  //   <SidebarFooter>
  //     <NavUser user={data.user} />
  //   </SidebarFooter>
  // </Sidebar>

  return (
    <Sidebar className="" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold">
            Clinica medica
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5 ">
            <SidebarMenu>
              {router.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      key={item.href}
                      // className={`flex items-center p-3 rounded-lg hover:bg-gray-300 transition ${
                      //   isExpanded ? "justify-start space-x-4" : "justify-center"
                      // }`}
                      className={cn(
                        "flex items-center p-3 rounded-lg transition"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <UserProfile firstName={googleName} logout={logout} picture={image} />
      </SidebarFooter>
    </Sidebar>
  );
}
