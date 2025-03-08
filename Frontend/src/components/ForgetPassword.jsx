import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/verifyacc.css";
import { useNavigate } from "react-router-dom";
import {
  forgetPassword,
  resendResetPasswordCode,
  resetPassword,
} from "../services/AuthService";

function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Request Email, 2: Reset Password
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
    setResendMessage("");
  };

  const handleRequestCode = async () => {
    setLoading(true);
    clearMessages();

    try {
      await forgetPassword(email);
      setSuccessMessage("Reset code sent to your email. Redirecting...");
      toast.success("Reset code sent to your email.");
      setTimeout(() => {
        clearMessages();
        setStep(2); // Move to the next step
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    clearMessages();

    try {
      await resetPassword(email, code, newPassword);
      setSuccessMessage("Password reset successful!");
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    clearMessages();

    try {
      await resendResetPasswordCode(email);
      setResendMessage("A new reset code has been sent to your email.");
      toast.info("A new reset code has been sent to your email.");
    } catch (error) {
      setError(err.message);
      toast.error(err.message);
    }
    setResendLoading(false);
  };

  return (
    <>
      <div className="resetPassContainer">
        <h1 className="signika-negative-regular">Reset Password</h1>
        <div className="mainReset">
          {step === 1 && (
            <>
              <p>
                Enter your Email Address to Recieve a Verification Code for
                Resetting your Password
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleRequestCode} disabled={loading}>
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>

              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
            </>
          )}

          {step === 2 && (
            <>
              <p>
                A Verification Code has been sent to your email-id:
                <b>{email}</b>. Enter the Verification Code & set a new
                Password.
              </p>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleResetPassword} disabled={loading}>
                {loading ? "Processing..." : "Reset Password"}
              </button>

              <p className="resend-text">
                Didn't receive the code?{" "}
                <span
                  onClick={handleResendCode}
                  className={resendLoading ? "disabled" : ""}
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </span>
              </p>

              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}

              {resendMessage && <p className="success">{resendMessage}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
