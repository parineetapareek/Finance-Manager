import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyAccount } from "../services/AuthService";
import "../styles/verifyEmail.css";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await VerifyAccount(email, code);
      setSuccessMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="verifyContainer">
        <h1>Verify Your Email to Complete Signup!</h1>
        <div className="mainVerify">
          <h4>
            A Verification Code has been sent to your email-id: {email}. Enter
            the Code to Verify your Account.
          </h4>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          {error && <p style={{ color: red }}>{error}</p>}
          {successMessage && <p style={{ color: green }}>{successMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
