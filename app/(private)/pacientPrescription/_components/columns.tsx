"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pacient } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, NotebookIcon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PacientType = {
  name: string;
  id: string;
};

function Counter(id: string) {
  const router = useRouter();
  router.push(`/pacient/${id}/edit`);
  // ...
}
const onEditinPacient = (id: string) => {
  const router = useRouter();
  router.push(`/pacient/${id}/edit`);
};

export const columns: ColumnDef<PacientType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDownIcon />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "id",
    header: "Editar",
    cell: ({ row }) => {
      const router = useRouter();
      const prescriptionId = row.getValue("id");

      return (
        <Button
          variant={"ghost"}
          onClick={() =>
            router.push(`/pacientPrescription/${prescriptionId}/edit`)
          }
        >
          <PencilIcon />
        </Button>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Atestado",
    cell: ({ row }) => {
      const router = useRouter();
      const prescriptionId = row.getValue("id");

      return (
        <Button
          variant={"ghost"}
          onClick={() => router.push(`/pacientPrescription/${prescriptionId}`)}
        >
          <NotebookIcon />
        </Button>
      );
    },
  },
];
