// middleware.js

import { NextResponse } from "next/server";

export function middleware(request: any) {
  //   // Simula a autenticação: `true` para logado, `false` para não logado
  //   const isAuthenticated = false; // Mude para `true` para testar o acesso
  //   // Define a rota privada que queremos proteger
  //   const privatePath = '/home';
  //   // Verifica se a requisição é para a rota privada
  //   if (request.nextUrl.pathname === privatePath) {
  //     // Se o usuário NÃO estiver autenticado
  //     if (!isAuthenticated) {
  //       // Redireciona o usuário para a página inicial
  //       // O `new URL` cria uma URL completa para o redirecionamento
  //       return NextResponse.redirect(new URL('/', request.url));
  //     }
  //   }
  //   // Se o usuário estiver autenticado ou a rota não for a privada,
  //   // permite que a requisição prossiga
  //   return NextResponse.next();
  // }
  // // O `config` é opcional, mas otimiza o middleware para rodar apenas
  // // em rotas específicas.
  // // export const config = {
  // //   matcher: ['/dashboard'], // O middleware será executado apenas para a rota /dashboard
  // // };
  // export const config = {
  //   matcher: [
  //     // Skip Next.js internals and all static files, unless found in search params
  //     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  //     // Always run for API routes
  //     "/(api|trpc)(.*)",
  //   ],
}
