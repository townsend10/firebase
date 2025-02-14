"use client";

import { useState } from "react";

export const ChatGpt = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getAudio() {
    if (!text) {
      alert("Digite um texto antes de gerar o áudio.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setAudioUrl(data.url);
      } else {
        console.error("Erro:", data.error);
      }
    } catch (error) {
      console.error("Erro ao gerar áudio:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-2">Gerador de Áudio com ChatGPT</h2>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
        placeholder="Digite um texto..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={getAudio}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Gerando áudio..." : "Gerar Áudio"}
      </button>

      {audioUrl && (
        <div className="mt-4">
          <p className="text-green-600">Áudio gerado com sucesso!</p>
          <audio controls className="w-full mt-2">
            <source src={audioUrl} type="audio/wav" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </div>
      )}
    </div>
  );
};
