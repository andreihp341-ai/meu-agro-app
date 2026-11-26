import { GoogleGenAI } from "@google/genai";

export default async (req) => {
  // Apenas aceita requisições do tipo POST
  if (req.method !== "POST") {
    return new Response("Método não permitido", { status: 405 });
  }

  try {
    // Credenciais injetadas automaticamente pelo Netlify AI Gateway
    const ai = new GoogleGenAI({});

    // Pega as informações enviadas pelo site (pergunta e perfil)
    const { prompt, perfil } = await req.json();

    // Define a personalidade da IA baseada na sua escolha
    const instrucao =
      perfil === "Produtor Rural"
        ? "Você é um consultor agrícola prático. Responda de forma simples, direta, usando termos do dia a dia do campo e focando em soluções fáceis de aplicar."
        : "Você é um Engenheiro Agrônomo sênior. Use termos técnicos, nomes científicos de pragas/doenças e embase suas respostas em dados agronômicos rigorosos.";

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `${instrucao}\n\nPergunta: ${prompt}`,
    });

    return Response.json({ reply: response.text });
  } catch (error) {
    console.error("Erro na comunicação com a IA:", error);
    return Response.json({ error: "Erro no servidor ao consultar a IA." }, { status: 500 });
  }
};
