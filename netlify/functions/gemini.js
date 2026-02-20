const { GoogleGenerativeAI } = require("@google-generative-ai/generative-ai");

exports.handler = async (event) => {
  // Apenas aceita requisições do tipo POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  try {
    // Inicializa a IA usando a chave que está no Netlify
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pega as informações enviadas pelo site (pergunta e perfil)
    const data = JSON.parse(event.body);
    const prompt = data.prompt;
    const perfil = data.perfil;

    // Define a personalidade da IA baseada na sua escolha
    let instrucao = "";
    if (perfil === "Produtor Rural") {
      instrucao = "Você é um consultor agrícola prático. Responda de forma simples, direta, usando termos do dia a dia do campo e focando em soluções fáceis de aplicar.";
    } else {
      instrucao = "Você é um Engenheiro Agrônomo sênior. Use termos técnicos, nomes científicos de pragas/doenças e embase suas respostas em dados agronômicos rigorosos.";
    }

    // Envia para o Google
    const result = await model.generateContent(`${instrucao}\n\nPergunta: ${prompt}`);
    const response = await result.response;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.text() }),
    };
  } catch (error) {
    console.error("Erro na comunicação com a IA:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro no servidor ou chave API inválida." }),
    };
  }
};
