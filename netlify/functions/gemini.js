const { GoogleGenerativeAI } = require("@google-generative-ai/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const data = JSON.parse(event.body);
    const { prompt, perfil } = data; // Recebe o texto e o perfil do site

    // Criamos a "personalidade" baseada no perfil escolhido
    let instrucaoSistema = "";
    if (perfil === "Produtor Rural") {
      instrucaoSistema = "Você é um consultor agrícola prático. Use linguagem simples, direta e termos do dia a dia do campo. Foque em soluções de fácil aplicação.";
    } else {
      instrucaoSistema = "Você é um Engenheiro Agrônomo sênior. Use termos técnicos, nomes científicos de pragas e doenças, e baseie suas respostas em dados agronômicos rigorosos.";
    }

    const result = await model.generateContent(`${instrucaoSistema}\n\nPergunta do usuário: ${prompt}`);
    const response = await result.response;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.text() }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro na conexão com a IA" }),
    };
  }
};
