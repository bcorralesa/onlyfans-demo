// src/routes/Welcome.tsx
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeModal.css";
import logo from "../assets/idverifier-logo.png";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h1>Welcome to OnlyFans</h1> <br />
        <p>Proceed to verify your age</p> <br />
        <button className="btn-primary" onClick={() => navigate("/verify")}>
          Proceed
        </button>
      </div>
    </div>
  );
}
