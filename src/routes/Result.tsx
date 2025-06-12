// src/routes/Result.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import idverifierLogo from "../assets/idverifier-logo.png";
import "../styles/global.css";
import "../styles/PageWithBackground.css";

type LocationState = {
  ageOver18: boolean;
  similarityScore?: number;
};

export default function Result() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/verify", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { similarityScore } = state;

  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={idverifierLogo} alt="ID Verifier" className="logo" />
        <h1>Sorry</h1>
        <p>You do not meet the minimum age requirement to enter.</p>
        {similarityScore !== undefined && (
          <p className="score">
            Your liveness similarity score was{" "}
            <strong>{similarityScore.toFixed(2)}%</strong>.
          </p>
        )}
        <button
          className="btn-secondary retry-button"
          onClick={() => navigate("/")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
