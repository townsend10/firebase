// Definindo as respostas do bot
const responses = {
  Olá: "Olá!",
  "Como você está?": "Estou bem, obrigado por perguntar!",
};

// Função para processar a mensagem e retornar a resposta do bot
function processMessage(message) {
  // Verifica se a mensagem está nas respostas do bot
  if (responses.hasOwnProperty(message)) {
    // Retorna a resposta correspondente à mensagem
    return responses[message];
  } else {
    // Se a mensagem não estiver nas respostas, retorna uma mensagem padrão
    return "Desculpe, não entendi. Pode repetir?";
  }
}

// Função principal do bot
function chatBot() {
  // Simula a entrada de mensagens (você pode substituir isso por um método real de entrada de mensagens)
  const inputMessages = [
    "Olá",
    "Como você está?",
    "O que você faz?",
    "Olá de novo",
  ];

  // Processa cada mensagem de entrada e exibe a resposta do bot
  inputMessages.forEach((message) => {
    console.log("Usuário: " + message);
    const response = processMessage(message);
    console.log("Bot: " + response);
    console.log("---");
  });
}

// Inicia o bot
chatBot();
