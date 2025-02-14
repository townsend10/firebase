"use client";

import { deleteCurrentUser } from "@/actions/delete-user";
import { getCurrentUser } from "@/actions/get-user";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export const UserInfo = () => {
  const paramas = useParams();
  const auth = getAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [googleName, setGoogleName] = useState<string | null | undefined>("");
  const [googlePhone, setGooglePhone] = useState<string | null | undefined>("");

  const [image, setImage] = useState("");
  const [googleImage, setGoogleImage] = useState<string | null | undefined>("");
  const router = useRouter();

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

  const { data: user, execute: deleteUser } = useAction(deleteCurrentUser, {
    onSuccess: (data: any) => {
      toast.success(`deletado ${data.name}`);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    getUser({
      id: `${paramas.userId}`,
      name: "",
      phone: "",
    });
  }, [getUser, paramas.userId]);

  const onDeleteUser = () => {
    deleteUser({
      id: `${paramas.userId}`,
    });
  };

  return (
    <div className="flex flex-col ml-[50px] mt-10">
      <h1 className="font-bold text-5xl">Usuarios</h1>
      <div className="">
        <div className="flex flex-col  mt-[30px]  text-2xl text-muted-foreground text-center uppercase">
          <p className="mt-2">nome: {name}</p>
          <p className="flex mt-2">
            tel: {phone} {googlePhone}{" "}
          </p>
          <div className="flex items-center justify-center mt-2 mb-2">
            <Image src={image} alt="photo" width={140} height={150} />
          </div>

          <Button
            className="mt-2"
            onClick={onDeleteUser}
            size="sm"
            variant="destructive"
          >
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
};
