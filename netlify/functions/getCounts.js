const fetch = require("node-fetch");

exports.handler = async function () {
  const siteId = process.env.YOUR_NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteId || !token) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing environment variables" }) };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const formsArray = Array.isArray(data) ? data : data.forms; // ensure it's an array
    if (!formsArray) throw new Error("No forms returned");

    const earlyForm = formsArray.find(f => f.name === "early-access");
    const contribForm = formsArray.find(f => f.name === "contrib-access");

    const earlyCount = earlyForm?.submissions?.length || 0;
    const contribCount = contribForm?.submissions?.length || 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ early: earlyCount, contrib: contribCount }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
