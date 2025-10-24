This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

## WEBSITE

https://firebase-mu-khaki.vercel.app/home

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

babel
// module.exports = {
// presets: [
// "next/babel", // Preset do Next.js para configuração padrão
// "@babel/preset-env", // Para compatibilidade com versões mais antigas do JavaScript, se necessário
// "@babel/preset-typescript", // Para suportar TypeScript
// // {
// // "preset-env": {},
// // "transform-runtime": {},
// // "styled-jsx": {},
// // "class-properties": {}
// // }
// ],
// // plugins: [
// // "@babel/plugin-transform-runtime", // Para evitar duplicação de código e melhorar o desempenho
// // // Outros plugins personalizados podem ser adicionados aqui
// // ],
// };




Componentes Principais:
App.jsx (Container Principal):

Será o ponto de entrada da aplicação.

Gerenciará o estado central do carrinho (cartItems), que será um array de objetos de produto (ex: { id, nome, preco, quantidade }).

Fornecerá as funções para manipular o carrinho (adicionarAoCarrinho, atualizarQuantidade, removerDoCarrinho) através de um CartContext.Provider.

Renderizará condicionalmente as telas (ProductGrid, ProductDetail, CartPage).

Header.jsx:

Contém a navegação principal (para a lista de produtos, por exemplo).

Incluirá o componente MiniCart (um ícone ou resumo do carrinho).

MiniCart.jsx:

Consumirá o CartContext para exibir o número de itens no carrinho ou um pequeno resumo.

Ao clicar, pode exibir um modal ou um dropdown com os itens do carrinho, permitindo visualização e modificação rápida de quantidades e remoção de produtos diretamente na tela atual. Isso será feito passando as funções de atualizarQuantidade e removerDoCarrinho via Context.

ProductGrid.jsx (Tela Inicial):

Exibirá uma grade de produtos (ProductCard). Os dados dos produtos podem ser um array JSON mockado localmente no frontend, já que não haverá um backend para a listagem inicial.

Cada ProductCard terá um botão "Ver Detalhes" (ou "Acessar Produto") que navegará para a tela ProductDetail para o produto selecionado.

ProductCard.jsx:

Componente individual que exibe a imagem, nome e preço de um produto.

Botão "Ver Detalhes" que aciona a navegação para o ProductDetail com o id do produto.

ProductDetail.jsx:

Carrega o produto atráves de um id.

Exibe os detalhes completos do produto.

Possui um campo de entrada para a quantidade e um botão "Adicionar ao Carrinho".

Ao adicionar ao carrinho, a lógica verificará se o produto já existe:

Se sim, somará a nova quantidade à existente.

Se não, adicionará o produto como um novo item no carrinho.

CartPage.jsx (Tela do Carrinho):

Consumirá o CartContext para exibir a lista completa de cartItems.

Renderizará um componente CartItem para cada produto no carrinho.

Cada CartItem permitirá modificar as quantidades (input numérico) e remover o produto.

Contém um formulário para os dados básicos do usuário (Nome, E-mail, Telefone), que será validado.

Um botão "Finalizar Cotação" que acionará o envio dos dados.

CartItem.jsx:

Exibe os detalhes de um item no carrinho (nome, quantidade, subtotal).
Botoes para adicionar ou diminuir uma quantidade de produto (ex: +, - ) 

Botão "Remover".

As principais tecnologias seria:

React 
React-hook-form (validaçao de dados do usuario)
Zod(validaçao de dados junto do react-hook-form)
Tailwind CSS 

Obs: Também poderia ser feito utilizando nextjs, junto de uma interface ui como shadcn, facilitando um pouco na construçao da interface com componentes ja prontos, também seria utiliado as mesma ferramentas descritas acima.


