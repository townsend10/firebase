"use client";

import { getAllPrescriptions } from "@/actions/get-all-prescriptions";
import { deletePrescription } from "@/actions/delete-prescription";
import { useAction } from "@/hooks/use-action";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  FileText,
  Calendar,
  ClockIcon,
  Printer,
  Search,
  User,
  Trash2,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface Prescription {
  id: string;
  name: string;
  date: any;
  days: number;
  content?: string;
  userId?: string;
}

export function AllPrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, execute, isLoading } = useAction(getAllPrescriptions, {
    onSuccess: (data) => {
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    },
    onError: (error) => {
      toast.error("Erro ao carregar atestados");
      console.error(error);
    },
  });

  const { execute: executeDelete, isLoading: isDeleting } = useAction(
    deletePrescription,
    {
      onSuccess: (data) => {
        toast.success("Atestado deletado com sucesso");
        // Remove from local state using the returned ID
        if (data?.id) {
          setPrescriptions((prev) => prev.filter((p) => p.id !== data.id));
          setFilteredPrescriptions((prev) =>
            prev.filter((p) => p.id !== data.id)
          );
        }
        setDeletedId(null);
      },
      onError: (error) => {
        toast.error(error);
        setDeletedId(null);
      },
    }
  );

  const [deletedId, setDeletedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletedId(id);
    executeDelete({ id });
  };

  useEffect(() => {
    execute({});
  }, [execute]);

  // Filter prescriptions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const filtered = prescriptions.filter((prescription) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        prescription.name?.toLowerCase().includes(searchLower) ||
        prescription.userId?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  if (isLoading) {
    return <LoadingSpinner text="Carregando atestados..." />;
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Todos os Atestados
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredPrescriptions.length} atestado
              {filteredPrescriptions.length !== 1 ? "s" : ""} encontrado
              {filteredPrescriptions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome do paciente ou ID do usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Prescriptions Grid */}
        {filteredPrescriptions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onDelete={handleDelete}
                isDeleting={isDeleting && deletedId === prescription.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm
                ? "Nenhum atestado encontrado"
                : "Nenhum atestado cadastrado"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Tente buscar com outros termos."
                : "Ainda não há atestados médicos emitidos no sistema."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PrescriptionCard({
  prescription,
  onDelete,
  isDeleting,
}: {
  prescription: Prescription;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  // Better handling for converting Firestore Timestamp to Date
  let formattedDate = "Data não disponível";

  try {
    if (prescription.date) {
      // Se for string (YYYY-MM-DD), adiciona hora para evitar problema de timezone
      if (typeof prescription.date === "string") {
        const date = new Date(prescription.date + "T12:00:00");
        formattedDate = date.toLocaleDateString("pt-BR");
      }
      // Se for um Timestamp do Firestore com método toDate
      else if (typeof prescription.date.toDate === "function") {
        // Adiciona offset de fuso horário se necessário, ou confia no toDate()
        // Geralmente toDate() retorna Date com hora exata. Se foi salvo como 00:00 UTC, pode dar problema.
        // Vamos assumir que se for Timestamp, está correto, mas se der problema, podemos ajustar.
        formattedDate = prescription.date.toDate().toLocaleDateString("pt-BR");
      }
      // Se for um objeto com seconds (Firestore Timestamp serializado)
      else if (prescription.date.seconds) {
        const date = new Date(prescription.date.seconds * 1000);
        formattedDate = date.toLocaleDateString("pt-BR");
      }
      // Se já for uma Date
      else if (prescription.date instanceof Date) {
        formattedDate = prescription.date.toLocaleDateString("pt-BR");
      }
    }
  } catch (error) {
    console.error("Erro ao formatar data:", error);
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita popups para imprimir o atestado.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Atestado - ${prescription.name}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 40px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .content {
              font-size: 18px;
              line-height: 1.6;
              text-align: justify;
              margin-bottom: 60px;
            }
            .footer {
              margin-top: 80px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .signature {
              text-align: center;
              border-top: 1px solid #000;
              padding-top: 10px;
              width: 250px;
            }
            .date {
              text-align: center;
            }
            .meta {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 40px;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            @media print {
              body { padding: 0; }
              @page { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Clínica Médica</h1>
            <p style="margin: 5px 0;">Dr. Administrador - CRM 123456</p>
            <p style="margin: 0; font-size: 14px; color: #555;">Rua da Saúde, 123 - Centro</p>
          </div>

          <div class="title">Atestado Médico</div>

          <div class="content">
            <p>
              Atesto para os devidos fins que o(a) Sr(a). <strong>${
                prescription.name
              }</strong>, 
              foi atendido(a) nesta data e necessita de <strong>${
                prescription.days
              } (${
      prescription.days === 1 ? "um" : "vários"
    }) dias</strong> de afastamento 
              de suas atividades laborais/escolares para tratamento de saúde.
            </p>
            <p style="margin-top: 20px;">
              CID: Z00.0 (Exame médico geral)
            </p>
          </div>

          <div class="footer">
            <div class="date">
              <p style="margin-bottom: 5px;">${formattedDate}</p>
              <p style="font-size: 14px; color: #555;">Data do Atendimento</p>
            </div>

            <div class="signature">
              <p style="font-weight: bold; margin: 0;">Dr. Administrador</p>
              <p style="font-size: 14px; margin: 0;">Médico Responsável</p>
            </div>
          </div>

          <div class="meta">
            Documento gerado eletronicamente em ${new Date().toLocaleString(
              "pt-BR"
            )}
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full relative group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg line-clamp-1">
              {prescription.name}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {prescription.days} dia{prescription.days !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>Afastamento: {prescription.days} dias</span>
          </div>
          {prescription.userId && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="truncate" title={prescription.userId}>
                ID: {prescription.userId.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 flex gap-2">
          <Button
            variant="outline"
            className="w-full flex-1"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="shrink-0"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner className="h-4 w-4 text-white" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  o atestado de <strong>{prescription.name}</strong> do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(prescription.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirmar Exclusão
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
