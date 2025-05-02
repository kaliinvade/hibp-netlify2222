
const fetch = require("node-fetch");

exports.handler = async function(event) {
  const email = event.queryStringParameters.email;
  const apiKey = process.env.HIBP_API_KEY;

  if (!email || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email ou chave da API não fornecidos." })
    };
  }

  try {
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
      headers: {
        "hibp-api-key": apiKey,
        "user-agent": "email-checker"
      }
    });

    if (response.status === 404) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao buscar dados da API." })
    };
  }
};
