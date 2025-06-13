// src/routes/AgeVerification.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAgeVerification } from "../hooks/useAgeVerification";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../assets/idverifier-logo.png";
import "../styles/global.css";
import "../styles/PageWithBackground.css";

export default function AgeVerification() {
  const { startVerification, loading, error, id } = useAgeVerification();
  const navigate = useNavigate();
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);

  // 1) Inicia verificación solo una vez al montar
  useEffect(() => {
    startVerification();
    // ignorar warning de deps para que no se vuelva a llamar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Maneja el evento solo una vez al montar
  useEffect(() => {
    const handler = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      const { age } = e.detail as { age: number };
      if (age >= 18) {
        navigate("/verified", { state: { age } });
      } else {
        navigate("/result", { state: { age } });
      }
    };
    window.addEventListener("ageVerificationResult", handler);
    return () => window.removeEventListener("ageVerificationResult", handler);
  }, [navigate]);

  // 3) Deep-link en móvil
  useEffect(() => {
    if (id && isMobile) {
      window.location.href = `idverifier://?id=${id}`;
    }
  }, [id, isMobile]);

  // 4) Reload tras 60 s
  useEffect(() => {
    const timer = setTimeout(() => window.location.reload(), 60_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        {loading && <p>Verifying age… please wait</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && id && !isMobile && (
          <>
            <p>Scan with your mobile to continue:</p>
            <div style={{ height: "1rem" }} />
            <QRCodeCanvas value={`idverifier://?id=${id}`} size={300} />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
              <strong>Do not close this page</strong>
              <br />
              Once you complete the process on your mobile,
              <br />
              the flow will automatically continue here.
            </p>
            <button
              className="btn-secondary"
              style={{ marginTop: "2rem" }}
              onClick={() => navigate("/")}
            >
              Return
            </button>
          </>
        )}
      </div>
    </div>
  );
}
