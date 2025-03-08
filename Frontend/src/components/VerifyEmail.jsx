import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuthUser,
  resendVerificationEmail,
  verifyAccount,
} from "../services/AuthService";
import "../styles/verifyacc.css";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const user = await getAuthUser();
        if (user.user.isVerified) {
          setSuccessMessage("Your account is already verified! Redirecting...");
          setIsVerified(true);
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        console.error("Error: ", err);
        setError("Failed to fetch user data!");
        setIsVerified(false);
      }
    };

    checkVerification();
  }, [navigate]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await verifyAccount(email, code);
      setSuccessMessage("Account verified successfully! Redirecting...");
      console.log(response);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      await resendVerificationEmail(email);
      setResendMessage("A new verification code has been sent to your email!");
      toast.info("A new verification code has been sent to your email!");
      setCode("");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (isVerified === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="verifyContainer">
        <h1 className="signika-negative-regular">
          Verify Your Email to Complete Signup!
        </h1>
        {isVerified ? (
          <p className="success">{successMessage}</p>
        ) : (
          <div className="mainVerify">
            <p>
              A Verification Code has been sent to your email-id: <b>{email}</b>
              . Enter the Code to Verify your Account.
            </p>
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <p className="resend-text">
              Didn't receive the code?{" "}
              <span
                onClick={handleResendCode}
                className={resendLoading ? "disabled" : ""}
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </span>
            </p>

            {resendMessage && <p className="success">{resendMessage}</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default VerifyEmail;
