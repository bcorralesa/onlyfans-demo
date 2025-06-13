// src/routes/Result.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/idverifier-logo.png";
import "../styles/global.css";
import "../styles/PageWithBackground.css";

type LocationState = { age: number };

export default function Result() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/verify", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h1>Sorry</h1>
        <p>
          Your age of {state.age} does not meet the minimum requirement of 18
          years.
        </p>
        <button
          className="btn-secondary"
          style={{ marginTop: "1.5rem" }}
          onClick={() => navigate("/")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
