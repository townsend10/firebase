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
import {
  IconCreditCard,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

interface UserProfileProps {
  picture: string;
  firstName: string | null | undefined;
  logout: () => void;
}
export const UserProfile = ({
  firstName,
  logout,
  picture,
}: UserProfileProps) => {
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger className="flex items-center cursor-pointer ">
    //     <div className="rounded-full overflow-hidden shadow-md">
    //       {picture ? (
    //         <Image src={picture} alt="img" className="w-10 h-10 object-cover" />
    //       ) : (
    //         <div className="flex flex-col items-center justify-center">
    //           <p className=" text-2xl ">{firstName?.charAt(0)}</p>
    //         </div>
    //       )}
    //     </div>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className=" bg-gray-900 rounded-md shadow-lg p-2">
    //     <DropdownMenuLabel className="font-semibold text-lg text-gray-800">
    //       <div className="flex items-center justify-center font-extrabold">
    //         <p className="text-white">{firstName} </p>
    //       </div>
    //     </DropdownMenuLabel>
    //     <DropdownMenuSeparator className="mt-2 mb-3" />
    //     <DropdownMenuItem asChild>
    //       <Button
    //         onClick={logout}
    //         variant="destructive"
    //         size="sm"
    //         className="flex items-center justify-center w-full text-white bg-red-600 hover:bg-red-700 transition-colors"
    //       >
    //         Desconectar
    //       </Button>
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>

    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={picture} alt="" />
                <AvatarFallback className="rounded-lg">
                  {firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{firstName}</span>
                {/* <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span> */}
              </div>
              {/* <IconDotsVertical className="ml-auto size-4" /> */}
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
                  <AvatarImage src={picture} alt="img" />
                  <AvatarFallback className="rounded-lg">
                    {" "}
                    {firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{firstName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {firstName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Log out 
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
