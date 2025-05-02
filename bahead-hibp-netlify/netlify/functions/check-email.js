const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body || '{}');
  const apiKey = process.env.HIBP_API_KEY;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email obrigatório." })
    };
  }

  const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
    headers: {
      'hibp-api-key': apiKey,
      'user-agent': 'netlify-function'
    }
  });

  if (response.status === 404) {
    return { statusCode: 200, body: JSON.stringify([]) };
  }

  const data = await response.json();
  return { statusCode: 200, body: JSON.stringify(data) };
};