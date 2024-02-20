"use client";
import { getPacient } from "@/actions/get-pacient.tsx";
import { getPacients } from "@/actions/get-pacients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SearchPacient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { data, execute, isLoading, query } = useAction(getPacients, {
    onSuccess: (data: any) => {
      setSearchResult(data); // Atualiza o estado com os resultados da busca
      toast.success("Busca realizada com sucesso");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSearch = () => {
    query; // Executa a busca com a consulta do usuário
  };

  return (
    <div>
      <Input />
    </div>
  );
};
