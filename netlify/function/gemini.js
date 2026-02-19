exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Metodo nao permitido" };
    
    try {
        const body = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY; // Pega a chave que você salvou no Netlify
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Perfil: ${body.role}\n\nPergunta: ${body.prompt}` }] }]
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text })
        };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: "Erro na conexao segura." }) };
    }
};
