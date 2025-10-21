import fetch from 'node-fetch';

export async function handler() {
  const siteId = 'nfp_PYiq4BHFAKEP7LsDrq93ad1Cz1Jkr3R4f7a8'; 
  const token = process.env.NETLIFY_API_TOKEN; // <- pulls your secret

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const forms = await res.json();

    const earlyForm = forms.find(f => f.name === "early-access");
    const contribForm = forms.find(f => f.name === "contrib-access");

    return {
      statusCode: 200,
      body: JSON.stringify({
        earlyCount: earlyForm ? earlyForm.submissions : 0,
        contribCount: contribForm ? contribForm.submissions : 0,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
