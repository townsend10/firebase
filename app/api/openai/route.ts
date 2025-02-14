import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Instância do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Criar um endpoint para o método POST
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Texto para conversão em áudio é obrigatório." },
        { status: 400 }
      );
    }

    // Chamar API da OpenAI para gerar áudio
    const response = await openai.chat.completions.create({
      //   model: "gpt-4o-audio-preview",
      model: "gpt-3.5-turbo", // ✅ Modelo correto

      modalities: ["text", "audio"],
      audio: { voice: "alloy", format: "wav" },
      messages: [{ role: "user", content: text }],
      store: true,
    });

    // Verificar se a resposta contém áudio
    const audioData = response.choices[0]?.message?.audio?.data;
    if (!audioData) {
      return NextResponse.json(
        { error: "Erro ao gerar áudio." },
        { status: 500 }
      );
    }

    // Retornar o base64 diretamente
    return NextResponse.json({
      message: "Áudio gerado com sucesso!",
      audioBase64: audioData, // Base64 enviado para o frontend
    });
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
