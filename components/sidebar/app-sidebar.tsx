import type { LucideIcon } from "lucide-react";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
  FileCheck,
  Settings,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { UserProfile } from "../user-profile";
import { Badge } from "@/components/ui/badge";

// --- Menu structure ---
interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: string[];
  section: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    href: "/home",
    label: "Página Inicial",
    icon: Home,
    roles: ["admin", "guest"],
    section: "Geral",
  },
  {
    href: "/profile",
    label: "Meu Perfil",
    icon: User2,
    roles: ["admin", "guest"],
    section: "Geral",
  },
  {
    href: "/games",
    label: "Games",
    icon: Gamepad2Icon,
    roles: ["admin", "guest"],
    section: "Geral",
  },
  {
    href: "/my-appointments",
    label: "Meus Agendamentos",
    icon: Calendar,
    roles: ["guest"],
    section: "Minha Área",
  },
  {
    href: "/book-appointment",
    label: "Agendar Consulta",
    icon: CalendarPlus,
    roles: ["guest"],
    section: "Minha Área",
  },
  {
    href: "/my-prescriptions",
    label: "Meus Atestados",
    icon: FileText,
    roles: ["guest"],
    section: "Minha Área",
  },
  {
    href: "/schedules",
    label: "Todos Agendamentos",
    icon: Contact,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/admin-book-appointment",
    label: "Novo Agendamento",
    icon: CalendarPlus,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/medicalPrescription",
    label: "Criar Atestado",
    icon: SyringeIcon,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/prescriptions",
    label: "Todos Atestados",
    icon: ClipboardList,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/laudo",
    label: "Laudos com IA",
    icon: FileCheck,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/users",
    label: "Gerenciar Usuários",
    icon: Users,
    roles: ["admin"],
    section: "Administração",
  },
  {
    href: "/mcp-test",
    label: "Integração MCP",
    icon: Settings,
    roles: ["admin"],
    section: "Desenvolvimento",
  },
];

const PUBLIC_ITEMS: MenuItem[] = [
  {
    href: "/login",
    label: "Login",
    icon: UserCog,
    roles: ["public"],
    section: "Acesso",
  },
  {
    href: "/register",
    label: "Cadastro",
    icon: Home,
    roles: ["public"],
    section: "Acesso",
  },
];

const SECTION_ICONS: Record<string, LucideIcon> = {
  Geral: Home,
  "Minha Área": User2,
  Administração: Settings,
  Desenvolvimento: Settings,
  Acesso: UserCog,
};

// --- Section header component ---
function SectionHeader({ label, icon }: { label: string; icon?: LucideIcon }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-2 px-2 mb-1 mt-4 first:mt-0">
      {Icon && <Icon className="size-3.5 text-muted-foreground" />}
      <SidebarGroupLabel className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/70 px-0 m-0">
        {label}
      </SidebarGroupLabel>
    </div>
  );
}

// --- Menu item link ---
function MenuLink({ item, isActive }: { item: MenuItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={item.label}
      className={cn(
        "transition-all duration-150",
        isActive
          ? "bg-primary/10 text-primary font-medium shadow-sm"
          : "hover:bg-accent/60",
      )}
    >
      <Link href={item.href}>
        <Icon className="size-4 shrink-0" />
        <span>{item.label}</span>
        {isActive && (
          <ChevronRight className="ml-auto size-3.5 text-primary/60" />
        )}
      </Link>
    </SidebarMenuButton>
  );
}

export function AppSidebar() {
  const { isLoggedIn, logout } = useAuth();
  const { role, isAdmin, loading: roleLoading, userData, isGuest } = useUserRole();

  const effectiveRole = role ?? "guest";
  const pathname = usePathname();

  // Compute visible items with useMemo to avoid recomputation
  const sections = useMemo(() => {
    const visibleItems = isLoggedIn
      ? MENU_ITEMS.filter((item) => item.roles.includes(effectiveRole))
      : PUBLIC_ITEMS;

    return visibleItems.reduce(
      (acc, item) => {
        const section = item.section;
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
      },
      {} as Record<string, MenuItem[]>,
    );
  }, [isLoggedIn, effectiveRole]);

  if (roleLoading && isLoggedIn) {
    return (
      <Sidebar variant="sidebar">
        <SidebarContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="sidebar" className="border-r">
      {/* Header */}
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Stethoscope className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-base font-bold tracking-tight truncate">
              Clínica Médica
            </span>
            <Badge
              variant={isAdmin ? "default" : "outline"}
              className="w-fit text-[0.6rem] px-1.5 py-0 font-medium"
            >
              {isAdmin ? "Administrador" : "Paciente"}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <Separator className="mx-4" />

      {/* Content */}
      <SidebarContent className="gap-1 px-2">
        {Object.entries(sections).map(([sectionName, items]) => (
          <SidebarGroup key={sectionName} className="px-0 py-0">
            <SectionHeader
              label={sectionName}
              icon={SECTION_ICONS[sectionName]}
            />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <MenuLink
                      item={item}
                      isActive={pathname === item.href}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      {isLoggedIn && (
        <>
          <Separator className="mx-3" />
          <SidebarFooter className="px-3 py-3">
            <UserProfile
              firstName={userData?.name ?? "Usuário"}
              logout={logout}
              picture={userData?.imageUrl ?? ""}
            />
          </SidebarFooter>
        </>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
