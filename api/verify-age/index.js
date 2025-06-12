// api/verify-age/index.js
module.exports = async function (context, req) {
  try {
    const resp = await fetch(
      "https://reactid-api-management.azure-api.net/idv/idvpayload",
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env["VITE_SUBS_KEY"],
        },
        body: JSON.stringify(req.body),
      }
    );
    const body = await resp.json();
    context.res = {
      status: resp.status,
      body,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message },
    };
  }
};
