"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "@/app/api/firebase/firebase-connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ClockIcon, Printer } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Prescription {
  id: string;
  name: string;
  date: any;
  days: number;
  content?: string;
  pacientId?: string;
}

export function MyPrescriptionsList() {
  const { userId, loading } = useUserRole();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

  useEffect(() => {
    const fetchMyPrescriptions = async () => {
      if (!userId) return;

      const db = getFirestore(firebaseApp);
      const prescriptionsRef = collection(db, "prescriptions");

      // Query prescriptions where pacientId matches userId
      const q = query(prescriptionsRef, where("pacientId", "==", userId));
      const querySnapshot = await getDocs(q);

      const prescriptionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Prescription[];

      setPrescriptions(prescriptionsData);
      setLoadingPrescriptions(false);
    };

    if (userId) {
      fetchMyPrescriptions();
    }
  }, [userId]);

  if (loading || loadingPrescriptions) {
    return <LoadingSpinner text="Carregando atestados..." />;
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Meus Atestados
            </h1>
            <p className="text-muted-foreground mt-1">
              {prescriptions.length} atestado
              {prescriptions.length !== 1 ? "s" : ""} no total
            </p>
          </div>
        </div>

        {/* Prescriptions Grid */}
        {prescriptions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum atestado</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não possui atestados médicos emitidos em seu nome.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PrescriptionCard({ prescription }: { prescription: Prescription }) {
  const formattedDate = prescription.date?.toDate
    ? new Date(prescription.date.toDate()).toLocaleDateString("pt-BR")
    : "Data não disponível";

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
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
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
        </div>

        <div className="pt-2">
          <Button variant="outline" className="w-full" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Atestado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
