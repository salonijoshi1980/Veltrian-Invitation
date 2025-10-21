// No need for node-fetch; Node 18+ has native fetch
exports.handler = async function(event) {
  // Only allow GET requests
  if (event.httpMethod && event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const siteId = process.env.YOUR_NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  try {
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const forms = await formsRes.json();

    const earlyForm = forms.find(f => f.name === "early-access");
    const contribForm = forms.find(f => f.name === "contrib-access");

    return {
      statusCode: 200,
      body: JSON.stringify({
        early: earlyForm?.submissions || 0,
        contrib: contribForm?.submissions || 0,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
