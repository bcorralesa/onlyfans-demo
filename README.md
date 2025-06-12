# onlyfans-demo

A React + Vite demo that replicates an age-verification flow for an OnlyFans-style product, **using the ID Verifier application** to handle document verification, liveness checks, and age validation.  
Supports both development (direct proxy to Azure APIM via Vite) and production (Express proxy).

## 🚀 Features

- **SPA navigation** with React Router v7
- **ID Verifier integration** for:
  - Document verification
  - Passive liveness check
  - Age-over-18 validation
- **Age verification hook** (`useAgeVerification`) with POST + polling every 2 s
- **QR-code flow** on desktop via `qrcode.react`
- **Mobile deep-link**: on mobile devices it opens the custom URI scheme (`idverifier://?id=…`) instead of showing a QR code
- **Pages**:
  - **Welcome** → “Proceed” to start
  - **AgeVerification** → QR or deep-link, polling results
  - **Verified** → on success, redirects to https://subseeker.co
  - **LivenessError** → when liveness check passes age but fails liveness
  - **Result** → when age check fails
- **Styling** via CSS variables (`--color-primary`, `--color-secondary`, `--color-accent`, …)
- **Background + modal** wrapper (`PageWithBackground.css`)

---

## 🎨 Palette & CSS Variables

Define your brand colors in `src/styles/global.css`:

```css
:root {
  /* OnlyFans-style blue */
  --color-primary: #00aff0;
  /* Hover/active for primary button */
  --color-secondary: #0a4468;
  /* Accent for retry buttons */
  --color-accent: #ff5500;
}
```

---

## 📦 Installation

1. **Clone** the repo:

   ```bash
   git clone https://github.com/bcorralesa/onlyfans-demo.git
   cd onlyfans-demo
   ```

2. **Install** dependencies:

   ```bash
   npm install
   ```

3. **Create** a `.env` file at project root:

   ```env
   VITE_SUBS_KEY=your_subscription_key
   VITE_APIM_BASE=https://your-apim.azure-api.net
   ```

   - `VITE_APIM_BASE` is used by Vite in development to proxy `/api/idv/*` requests.

---

## 🔧 Available Scripts

| Command           | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Starts Vite dev server, proxies `/api/idv/*` to your APIM      |
| `npm run build`   | Builds production assets into `dist/`                          |
| `npm run start`   | Runs Express proxy (`server.js`) and serves the `dist/` folder |
| `npm run preview` | Serves the production build via Vite’s preview server          |
| `npm run lint`    | Runs ESLint over `src/` files                                  |

---

## 🗂️ Project Structure

```
onlyfans-demo/
├── public/
│   └── assets/
│       ├── onlyfans-bg.jpg
│       └── onlyfans-logo.png
├── server.js            # Express proxy for production
├── vite.config.ts       # Vite config & dev-proxy
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── hooks/
    │   └── useAgeVerification.ts      # POST + polling hook
    ├── routes/
    │   ├── Welcome.tsx
    │   ├── AgeVerification.tsx        # Uses ID Verifier application
    │   ├── Verified.tsx
    │   ├── LivenessError.tsx
    │   └── Result.tsx
    └── styles/
        ├── global.css
        ├── PageWithBackground.css
        └── WelcomeModal.css
```

---

## ⚙️ Configuration

### Vite Dev Proxy (`vite.config.ts`)

```ts
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/idv": {
          target: env.VITE_APIM_BASE,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/idv/, "/idv"),
        },
      },
    },
  };
});
```

### Express Proxy (`server.js`)

```js
const express = require("express");
const path = require("path");
const SUBS_KEY = process.env.VITE_SUBS_KEY;
const APIM_BASE = process.env.VITE_APIM_BASE;

if (!SUBS_KEY || !APIM_BASE) process.exit(1);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/verify-age", async (req, res) => {
  const resp = await fetch(`${APIM_BASE}/idv/idvpayload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": SUBS_KEY,
    },
    body: JSON.stringify(req.body),
  });
  res.status(resp.status).json(await resp.json());
});

app.get("/api/verify-age/:id", async (req, res) => {
  const resp = await fetch(`${APIM_BASE}/idv/idvpayload/${req.params.id}`, {
    headers: { "Ocp-Apim-Subscription-Key": SUBS_KEY },
  });
  if (resp.status === 404) return res.sendStatus(404);
  res.status(resp.status).json(await resp.json());
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 3000);
```

---

## 📱 Mobile Deep-Link Behavior

In **`AgeVerification.tsx`**, the app detects mobile user agents:

```ts
const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);

useEffect(() => {
  if (id && isMobile) {
    window.location.href = `idverifier://?id=${id}`;
  }
}, [id, isMobile]);
```

- **Desktop**: shows a QR code (`<QRCodeCanvas/>`) to scan.
- **Mobile**: immediately launches the `idverifier://` URI scheme with the returned `id`.

---

## 🙌 Next Steps

- Swap in your own logos & backgrounds.
- Tweak CSS variables for your brand palette.
- Extend ID Verifier settings (e.g. adjust liveness threshold).
- Add analytics or additional error handling.

---

## 📄 License

MIT © React International Solutions
