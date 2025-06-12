// server.js
const express = require("express");
const path = require("path");

// Lee variables de entorno VITE_SUBS_KEY y VITE_APIM_BASE
const SUBS_KEY = process.env.VITE_SUBS_KEY;
const APIM_BASE = process.env.VITE_APIM_BASE;
if (!SUBS_KEY || !APIM_BASE) {
  console.error("❌ Faltan VITE_SUBS_KEY o VITE_APIM_BASE en las env vars.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sirve el build de Vite (carpeta dist tras el build)
app.use(express.static(path.join(__dirname, "dist")));

// Proxy POST para inicio de verificación
app.post("/api/verify-age", async (req, res) => {
  try {
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUBS_KEY,
      },
      body: JSON.stringify(req.body),
    });
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error("Proxy POST error:", err);
    res.status(500).json({ error: err.message || "Proxy error" });
  }
});

// Proxy GET para polling
app.get("/api/verify-age/:id", async (req, res) => {
  try {
    const resp = await fetch(`${APIM_BASE}/idv/idvpayload/${req.params.id}`, {
      headers: { "Ocp-Apim-Subscription-Key": SUBS_KEY },
    });
    if (resp.status === 404) return res.sendStatus(404);
    const body = await resp.json();
    res.status(resp.status).json(body);
  } catch (err) {
    console.error("Proxy GET error:", err);
    res.status(500).json({ error: err.message || "Proxy error" });
  }
});

// Fallback SPA: cualquier otra ruta carga index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server escuchando en puerto ${port}`);
});
