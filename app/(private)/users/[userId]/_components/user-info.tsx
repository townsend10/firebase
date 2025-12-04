"use client";

import { deleteCurrentUser } from "@/actions/delete-user";
import { getCurrentUser } from "@/actions/get-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAction } from "@/hooks/use-action";
import { useUserRole } from "@/hooks/use-user-role";
import { maskCpf } from "@/lib/mask-cpf";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
  UserCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Helper to get initials from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "U";

  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

export const UserInfo = () => {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, loading: roleLoading } = useUserRole();

  const [userData, setUserData] = useState<any>(null);

  const { execute: getUser, isLoading } = useAction(getCurrentUser, {
    onSuccess: (data: any) => {
      setUserData(data);
    },
    onError: (error) => {
      toast.error("Erro ao carregar usuário: " + error);
      router.push("/users");
    },
  });

  const { execute: deleteUser, isLoading: isDeleting } = useAction(
    deleteCurrentUser,
    {
      onSuccess: (data: any) => {
        toast.success(`Usuário ${data.name} deletado com sucesso!`);
        router.push("/users");
      },
      onError: (error) => {
        toast.error("Erro ao deletar usuário: " + error);
      },
    }
  );

  useEffect(() => {
    if (isAdmin && params.userId) {
      getUser({
        id: `${params.userId}`,
        name: "",
        phone: "",
        email: "",
        cpf: "",
      });
    }
  }, [isAdmin, params.userId, getUser]);

  const onDeleteUser = () => {
    deleteUser({
      id: `${params.userId}`,
    });
  };

  if (roleLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = getInitials(userData.name);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Detalhes do Usuário
          </h2>
          <p className="text-muted-foreground">
            Visualize e gerencie informações do usuário
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={userData.imageUrl || "/avatar.png"}
                  alt={userData.name}
                />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {userData.name || "Sem nome"}
            </CardTitle>
            <CardDescription>
              <Badge
                variant={userData.role === "admin" ? "default" : "secondary"}
              >
                {userData.role === "admin" ? "Administrador" : "Paciente"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.email || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.phone || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">CPF</p>
                  <p className="text-sm text-muted-foreground">
                    {maskCpf(userData.cpf)}
                  </p>
                </div>
              </div>

              {userData.birthdayDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Data de Nascimento</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userData.birthdayDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>
              Gerencie as informações e permissões deste usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Informações do Sistema</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID do Usuário:</span>
                  <span className="font-mono">{params.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UID Firebase:</span>
                  <span className="font-mono">{userData.uid || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Conta:</span>
                  <span>
                    {userData.role === "admin" ? "Administrador" : "Paciente"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-destructive">Zona de Perigo</h3>
              <p className="text-sm text-muted-foreground">
                Ações irreversíveis que afetam permanentemente este usuário.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deletando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar Usuário
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você tem certeza absoluta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá deletar
                      permanentemente o usuário <strong>{userData.name}</strong>{" "}
                      e remover todos os dados associados dos nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteUser}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, deletar usuário
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
