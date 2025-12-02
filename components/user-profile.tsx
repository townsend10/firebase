import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";

interface UserProfileProps {
  picture: string;
  firstName: string | null | undefined;
  logout: () => void;
}

// Helper function to get initials from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";

  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  // First letter of first name + first letter of last name
  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

// Helper to get first name only
const getFirstName = (name: string | null | undefined): string => {
  if (!name) return "Usuário";
  return name.trim().split(" ")[0];
};

export const UserProfile = ({
  firstName,
  logout,
  picture,
}: UserProfileProps) => {
  const initials = getInitials(firstName);
  const displayName = getFirstName(firstName);
  const fullName = firstName || "Usuário";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={picture} alt={fullName} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  Ver perfil
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={useIsMobile() ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={picture} alt={fullName} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Clínica Médica
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
