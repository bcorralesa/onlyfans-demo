// src/hooks/useAgeVerification.ts
import { useState, useEffect, useRef } from "react";

// Subscription key VITE_SUBS_KEY
const SUBS_KEY = import.meta.env.VITE_SUBS_KEY!;

// Endpoints (dev ↔ prod)
const POST_URL = import.meta.env.DEV
  ? "/api/idv/idvpayload"
  : "/api/verify-age";
const GET_URL = (respId: string) =>
  import.meta.env.DEV
    ? `/api/idv/idvpayload/${respId}`
    : `/api/verify-age/${respId}`;

export function useAgeVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const respIdRef = useRef<string | null>(null);

  const startVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": SUBS_KEY,
        },
        body: JSON.stringify({
          payload: {
            documentVerification: {
              portraitLivenessPassive: true,
              ageOver18: true,
            },
          },
        }),
      });
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      const body = (await res.json()) as { id: string; responseId: string };

      // id para el QR
      setId(body.id);
      // responseId para el polling
      respIdRef.current = body.responseId;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!respIdRef.current) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(GET_URL(respIdRef.current!), {
          headers: { "Ocp-Apim-Subscription-Key": SUBS_KEY },
        });
        // sigue pendiente si 404
        if (res.status === 404) return;

        const body = await res.json();
        // si no vienen resultados aún, seguimos
        if (!body.documentVerificationResults) return;

        clearInterval(interval);
        window.dispatchEvent(
          new CustomEvent("ageVerificationResult", { detail: body })
        );
      } catch (e: unknown) {
        clearInterval(interval);
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  return { startVerification, loading, error, id };
}
