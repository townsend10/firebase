"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-current-user";
import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";

import {
  Calendar,
  Contact,
  Gamepad2Icon,
  Home,
  User2,
  UserCog,
  SyringeIcon,
  CalendarPlus,
  FileText,
  ClipboardList,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserProfile } from "../user-profile";
import { getAuth } from "firebase/auth";
import { useAction } from "@/hooks/use-action";
import { getCurrentUser } from "@/actions/get-user";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const { isLoggedIn, user } = useAuth();
  const { role, isAdmin, isGuest, loading: roleLoading } = useUserRole();
  const pathname = usePathname(); // Track current route
  const [phone, setPhone] = useState("");
  const [googleName, setGoogleName] = useState<string | null | undefined>("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  const auth = getAuth();
  const userId = auth.currentUser;

  const { data, execute: getUser } = useAction(getCurrentUser, {
    onSuccess: (data: any) => {
      setName(data.name);
      setGoogleName(auth.currentUser?.displayName);
      setPhone(data.phone);
      setImage(data.imageUrl);
    },
    onError: (error) => {
      // Handle error silently
    },
  });

  useEffect(() => {
    if (auth.currentUser?.uid) {
      getUser({
        id: auth.currentUser.uid,
        name: "",
        phone: "",
      });
    }
  }, [userId, auth.currentUser?.uid, getUser]);

  const { logout: authLogout } = useAuth();

  const logout = async () => {
    await authLogout();
  };

  // Define menu item type
  interface MenuItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    roles: string[];
    section?: string;
  }

  // Define menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    if (!isLoggedIn) {
      return [
        {
          href: "/login",
          label: "Login",
          icon: <UserCog className="h-4 w-4" />,
          roles: ["public"],
        },
        {
          href: "/register",
          label: "Cadastro",
          icon: <Home className="h-4 w-4" />,
          roles: ["public"],
        },
      ];
    }

    // Menu items with role restrictions
    const menuItems: MenuItem[] = [
      {
        href: "/home",
        label: "Página Inicial",
        icon: <Home className="h-4 w-4" />,
        roles: ["admin", "guest"],
        section: "Geral",
      },
      {
        href: "/profile",
        label: "Meu Perfil",
        icon: <User2 className="h-4 w-4" />,
        roles: ["admin", "guest"],
        section: "Geral",
      },
      {
        href: "/games",
        label: "Games",
        icon: <Gamepad2Icon className="h-4 w-4" />,
        roles: ["admin", "guest"],
        section: "Geral",
      },

      // Guest-specific items
      {
        href: "/my-appointments",
        label: "Meus Agendamentos",
        icon: <Calendar className="h-4 w-4" />,
        roles: ["guest"],
        section: "Minha Área",
      },
      {
        href: "/book-appointment",
        label: "Agendar Consulta",
        icon: <CalendarPlus className="h-4 w-4" />,
        roles: ["guest"],
        section: "Minha Área",
      },
      {
        href: "/my-prescriptions",
        label: "Meus Atestados",
        icon: <FileText className="h-4 w-4" />,
        roles: ["guest"],
        section: "Minha Área",
      },

      // Admin-only items

      {
        href: "/schedules",
        label: "Todos Agendamentos",
        icon: <Contact className="h-4 w-4" />,
        roles: ["admin"],
        section: "Administração",
      },
      {
        href: "/admin-book-appointment",
        label: "Novo Agendamento",
        icon: <CalendarPlus className="h-4 w-4" />,
        roles: ["admin"],
        section: "Administração",
      },
      {
        href: "/medicalPrescription",
        label: "Criar Atestado",
        icon: <SyringeIcon className="h-4 w-4" />,
        roles: ["admin"],
        section: "Administração",
      },
      {
        href: "/prescriptions",
        label: "Todos Atestados",
        icon: <ClipboardList className="h-4 w-4" />,
        roles: ["admin"],
        section: "Administração",
      },
    ];

    // Filter items based on user role
    return menuItems.filter((item) => {
      if (!role) return false;
      return item.roles.includes(role);
    });
  };

  const menuItems = getMenuItems();

  // Group items by section
  const sections = menuItems.reduce((acc, item) => {
    const section = item.section || "Outros";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (roleLoading && isLoggedIn) {
    return (
      <Sidebar className="" variant="sidebar">
        <SidebarContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel className="text-2xl font-bold">
              Clínica Médica
            </SidebarGroupLabel>
            {role && (
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="text-xs"
              >
                {isAdmin ? "Admin" : "Guest"}
              </Badge>
            )}
          </div>

          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName} className="mt-4">
              <SidebarGroupLabel className="text-sm text-muted-foreground px-4">
                {sectionName}
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center p-3 rounded-lg transition"
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile
          firstName={googleName || name}
          logout={logout}
          picture={image}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
