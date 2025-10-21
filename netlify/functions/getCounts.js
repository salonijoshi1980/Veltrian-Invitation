const fetch = require("node-fetch");

exports.handler = async function () {
  const siteId = process.env.YOUR_NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteId || !token) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing environment variables" }) };
  }

  try {
    // 1. Get all forms
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const formsData = await formsRes.json();
    const formsArray = Array.isArray(formsData) ? formsData : formsData.forms;

    if (!formsArray) throw new Error("No forms returned");

    // Find your forms
    const earlyForm = formsArray.find(f => f.name === "early-access");
    const contribForm = formsArray.find(f => f.name === "contrib-access");

    // 2. Fetch submissions separately for full email list
    async function getAllEmails(form) {
      if (!form) return [];
      const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subsData = await subsRes.json();
      return subsData.map(s => s.data.email);
    }

    const earlyEmails = await getAllEmails(earlyForm);
    const contribEmails = await getAllEmails(contribForm);

    return {
      statusCode: 200,
      body: JSON.stringify({
        early: earlyEmails.length,
        contrib: contribEmails.length,
        earlyEmails,
        contribEmails
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
