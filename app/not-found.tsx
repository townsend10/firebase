"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-7xl font-extrabold text-muted-foreground/30">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 h-9 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </button>
        <Link
          href="/home"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 h-9 text-sm font-medium ring-offset-background transition-colors hover:bg-primary/90"
        >
          <Home className="mr-2 size-4" />
          Ir para Home
        </Link>
      </div>
    </div>
  );
}
