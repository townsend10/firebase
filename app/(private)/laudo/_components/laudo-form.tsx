"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRole } from "@/hooks/use-user-role";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

export const LaudoForm = () => {
  const router = useRouter();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use JPG, PNG ou PDF.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Tamanho máximo: 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    toast.success(`Arquivo "${file.name}" selecionado com sucesso!`);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Arquivo removido");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laudos com IA</h2>
        <p className="text-muted-foreground">
          Gere laudos médicos automaticamente usando inteligência artificial
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Arquivo
            </CardTitle>
            <CardDescription>
              Selecione uma imagem ou PDF para gerar o laudo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={handleButtonClick}
              className="w-full"
              variant="outline"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Escolher Arquivo
            </Button>

            {selectedFile && (
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>Formatos aceitos: JPG, PNG, PDF</p>
              <p>Tamanho máximo: 10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prévia do Arquivo
            </CardTitle>
            <CardDescription>
              Visualize o arquivo selecionado antes de processar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : selectedFile?.type === "application/pdf" ? (
              <div className="flex items-center justify-center w-full aspect-[4/3] rounded-lg border bg-muted">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Prévia de PDF não disponível
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full aspect-[4/3] rounded-lg border bg-muted">
                <div className="text-center space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum arquivo selecionado
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Laudo</CardTitle>
          <CardDescription>
            Processe o arquivo selecionado para gerar um laudo médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" disabled={!selectedFile}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Laudo com IA
          </Button>
          {!selectedFile && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Selecione um arquivo para continuar
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
