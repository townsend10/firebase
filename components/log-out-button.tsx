"use client";

import { logOut } from "@/app/api/firebase/firebase-auth";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const LogOutButton = () => {
  const router = useRouter();
  const onClick = async () => {
    try {
      await logOut();

      toast.success("deslogado com sucesso");
      router.push("/login");
    } catch (error) {
      toast.error("FALHA");
    }
  };

  return (
    <div>
      <Button onClick={onClick}>
        <LogOut color="yellow" />
      </Button>
    </div>
  );
};
