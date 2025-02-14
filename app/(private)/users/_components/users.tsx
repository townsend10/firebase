"use client";

import { getCurrentUsers } from "@/actions/get-users";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Users = () => {
  const auth = getAuth();

  const [googleName, setGoogleName] = useState<string | null | undefined>("");
  const [googlePhone, setGooglePhone] = useState<string | null | undefined>("");
  const { data, execute: getUsers } = useAction(getCurrentUsers, {
    onSuccess: (data: any) => {
      toast.success(`ola ${data.name}`);
    },
    onError: (error) => {
      // toast.error(error);
    },
  });

  const router = useRouter();

  if (!auth) {
    return;
  }

  // useEffect(() => {
  //   setGoogleName("dia");
  //   getUsers({
  //     id: "",
  //     name: "",
  //     phone: "",
  //   });
  // }, []);
  return (
    <div className="flex flex-col ml-[50px] mt-10">
      <h1 className="font-bold text-5xl">Usuarios</h1>
      <div className="">
        {data?.map((user) => (
          <div
            key={user.id}
            className="flex flex-col  mt-[30px]  text-2xl text-muted-foreground text-center uppercase"
          >
            <p className="mt-2">
              nome: {user.name} {googleName}{" "}
            </p>
            <p className="">tel{user.phone}</p>
            <Button
              className="mt-2"
              onClick={() => {
                router.push(`/users/${user.id}`);
              }}
              size="sm"
              variant="default"
            >
              Info
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
