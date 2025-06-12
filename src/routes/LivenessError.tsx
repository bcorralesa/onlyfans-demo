// src/routes/LivenessError.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import idverifierLogo from "../assets/idverifier-logo.png";
import "../styles/global.css";
import "../styles/PageWithBackground.css";

type LocationState = { similarityScore: number };

export default function LivenessError() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { similarityScore } = state;

  return (
    <div className="page-with-background">
      <div className="modal">
        <img src={idverifierLogo} alt="ID Verifier" className="logo" />
        <h1>Liveness Check Failed</h1>
        <p>
          Your liveness similarity score was{" "}
          <strong>{similarityScore.toFixed(2)}%</strong>, below the required{" "}
          <strong>80%</strong> threshold.
        </p>
        <p>Please follow the instructions carefully and try again.</p>
        <button onClick={() => navigate("/verify")} className="btn btn-accent">
          Retry Liveness Check
        </button>
      </div>
    </div>
  );
}
