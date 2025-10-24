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
  phone: string;
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
  // {
  //   id: "id",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

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
    accessorKey: "phone",
    header: "Telefone",
  },

  {
    accessorKey: "id",
    header: "Editar",
    cell: ({ row }) => {
      const router = useRouter();
      const pacinetId = row.getValue("id");

      return (
        <Button
          variant={"ghost"}
          onClick={() => router.push(`/pacient/${pacinetId}/edit`)}
        >
          <PencilIcon />
        </Button>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Agendar",
    cell: ({ row }) => {
      const router = useRouter();
      const pacinetId = row.getValue("id");

      return (
        <Button
          variant={"ghost"}
          onClick={() => router.push(`/pacient/${pacinetId}/schedule`)}
        >
          <NotebookIcon />
        </Button>
      );
    },
  },
];
