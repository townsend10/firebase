"use client";

import { getCurrentUsers } from "@/actions/get-users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAction } from "@/hooks/use-action";
import { useUserRole } from "@/hooks/use-user-role";
import { maskCpf } from "@/lib/mask-cpf";
import { Eye, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const Users = () => {
  const router = useRouter();
  const { isAdmin, loading: roleLoading } = useUserRole();

  const {
    data: users,
    execute: getUsers,
    isLoading,
  } = useAction(getCurrentUsers, {
    onSuccess: () => {
      // Silent success
    },
    onError: (error) => {
      toast.error("Erro ao carregar usuários: " + error);
    },
  });

  useEffect(() => {
    if (isAdmin) {
      getUsers({
        id: "",
        name: "",
        phone: "",
      });
    }
  }, [isAdmin, getUsers]);

  if (roleLoading) {
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <Button onClick={() => router.push("/admin-book-appointment")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {users?.length || 0} usuário(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Nome
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Telefone
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      CPF
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {user.name || "Não informado"}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {user.phone || "Não informado"}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {maskCpf(user.cpf)}
                      </td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Paciente"}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">
                Nenhum usuário encontrado
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comece cadastrando um novo usuário
              </p>
              <Button onClick={() => router.push("/admin-book-appointment")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Usuário
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
