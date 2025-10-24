"use client";

import { getPrescription } from "@/actions/get-prescription";
import { useAction } from "@/hooks/use-action";
import { PrinterIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface PacientPrescriptionProps {
  content: string;
}
export const PacientPrescription = ({ content }: PacientPrescriptionProps) => {
  const params = useParams();

  const prescriptionid = params.prescriptionId as string;
  const [name, setName] = useState("");
  const router = useRouter();

  console.log("id", prescriptionid);
  const { data, execute, isLoading } = useAction(getPrescription, {
    onSuccess: (data) => {
      toast.success(`${data.name} bem vindo   `);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    execute({ content, id: prescriptionid });
  }, [content]);

  const printElementById = (elementId: string, title: string) => {
    const elementToPrint = document.getElementById(elementId);

    if (!elementToPrint) {
      console.error(
        `Elemento com ID '${elementId}' não encontrado para impressão.`
      );
      return;
    }

    // Abre uma nova janela/tab vazia
    const printWindow = window.open("", "_blank", "height=600,width=800");

    if (printWindow) {
      const doc = printWindow.document; // Referência ao documento da nova janela
      doc.open(); // Abre o fluxo de escrita

      // 1. Cria o elemento HTML raiz
      const html = doc.createElement("html");

      // 2. Cria o cabeçalho (<head>)
      const head = doc.createElement("head");
      const titleTag = doc.createElement("title");
      titleTag.textContent = title;
      head.appendChild(titleTag);

      // 3. Injeta os estilos (CSS)
      const style = doc.createElement("style");
      style.textContent = `
      @page{
      margin:0
      }
      body { 
        font-family: Arial, sans-serif; 
        margin: 0; 
        padding: 50px; 
      }
      .printable-content {
        margin: 0 auto; 
        max-width: 700px; 
        font-size: 1.25rem; 
        line-height: 1.8;
        text-align: justify;
      }
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
        .signature-block {
          width: 100%;
          max-width: 700px;
          /* 🎉 NOVIDADE: Empurra o bloco para o final do contêiner flexível (body) */
          margin-top: auto; 
          
          /* Adiciona um espaço extra no topo do bloco de assinatura */
          padding-top: 50px; 
      }
    `;
      head.appendChild(style);
      html.appendChild(head);

      // 4. Cria o corpo (<body>)
      const body = doc.createElement("body");

      // -- Adiciona o Cabeçalho da Clínica --
      const headerDiv = doc.createElement("div");
      headerDiv.className = "header";
      headerDiv.innerHTML = `
      <h1>CLÍNICA MÉDICA</h1>
      <p>Rua Exemplo, 123 | Tel: (21) 9999-9999</p>
      <hr style="margin-top: 20px; border-color: #000;" />
    `;
      body.appendChild(headerDiv);

      // -- Adiciona o Conteúdo da Prescrição --
      const contentDiv = doc.createElement("div");
      contentDiv.className = "printable-content";
      // Importante: Copia o HTML interno do elemento original
      contentDiv.innerHTML = elementToPrint.innerHTML;
      body.appendChild(contentDiv);

      const signatureDiv = doc.createElement("div");
      signatureDiv.className = "signature-block";
      signatureDiv.innerHTML = `
        <div style="margin-top: 80px; text-align: center;">
            <p style="border-top: 1px solid #000; width: 300px; display: inline-block; margin-bottom: 5px;"></p>
            <p style="font-size: 0.9rem; margin: 0; padding: 0;">Assinatura e Carimbo do Médico(a)</p>
            <p style="font-size: 0.8rem; margin-top: 10px;">Nome do Médico: __________________________ CRM: ___________</p>
        </div>
    `;
      body.appendChild(signatureDiv);

      html.appendChild(body);

      // Adiciona o HTML ao documento
      doc.appendChild(html);

      doc.close(); // Fecha o fluxo de escrita

      // Foco e Impressão

      printWindow.print();
    } else {
      alert(
        "Não foi possível abrir a janela de impressão. Por favor, desabilite o bloqueador de pop-ups."
      );
    }
  };
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      {/* Container da Prescrição: Simula uma folha A4 e centraliza o texto dentro dela */}
      <div className="w-full max-w-4xl bg-white shadow-xl p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">CLÍNICA MÉDICA</h2>
          <p className="text-gray-600">
            Rua Exemplo, 123 | Telefone: (21) 9999-9999
          </p>
          <hr className="mt-4 border-gray-300" />
        </div>

        {/* 1. Div com o ID CORRETO para a impressão */}
        <div
          id="content-print"
          className="whitespace-pre-wrap text-lg leading-relaxed text-gray-800"
        >
          {isLoading ? (
            <p className="text-center text-gray-500">
              Carregando conteúdo da prescrição...
            </p>
          ) : (
            data?.content || "Nenhuma prescrição encontrada."
          )}
        </div>

        <hr className="mt-8 border-gray-300" />

        {/* 2. Botão com o ID CORRETO e centralizado */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => printElementById("content-print", "Atestado")} // ID CORRIGIDO AQUI!
            disabled={!data || isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            <PrinterIcon className="w-5 h-5" />
            <span>Imprimir Receita</span>
          </button>
        </div>
      </div>
    </div>
  );
};
