// src/routes/Verified.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import idverifierLogo from "../assets/idverifier-logo.png";
import "../styles/global.css";
import "../styles/PageWithBackground.css";

type LocationState = {
  ageOver18: boolean;
  similarityScore?: number;
};

export default function Verified() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/verify", { replace: true });
      return;
    }
    const timer = setTimeout(() => {
      if (state.ageOver18) {
        window.location.replace("https://subseeker.co");
      } else {
        navigate("/result", { replace: true });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={idverifierLogo} alt="ID Verifier" className="logo" />
        <h2 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>
          Age Verified
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          Your age has been successfully verified!
          <br />
          Redirecting you now… please wait.
        </p>

        {typeof state.similarityScore === "number" && (
          <p style={{ marginBottom: "1rem" }}>
            Your liveness similarity score was{" "}
            <strong>{state.similarityScore.toFixed(2)}%</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
