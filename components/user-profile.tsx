import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserProfileProps {
  picture?: string | null;
  firstName: string | null | undefined;
  logout: () => void;
}
export const UserProfile = ({
  firstName,
  logout,
  picture,
}: UserProfileProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center cursor-pointer ">
        <div className="rounded-full overflow-hidden shadow-md">
          {picture ? (
            <Image src={picture} alt="img" className="w-10 h-10 object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className=" text-2xl ">{firstName?.charAt(0)}</p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-gray-900 rounded-md shadow-lg p-2">
        <DropdownMenuLabel className="font-semibold text-lg text-gray-800">
          <div className="flex items-center justify-center font-extrabold">
            <p className="text-white">{firstName} </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mt-2 mb-3" />
        <DropdownMenuItem asChild>
          <Button
            onClick={logout}
            variant="destructive"
            size="sm"
            className="flex items-center justify-center w-full text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Desconectar
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
