import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContent } from "../context/AppContext";
import { login, signup } from "../services/AuthService";
import "../styles/authmodel.css";

function AuthModal({ isOpen, onClose }) {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn, setUserData } = useContext(AppContent);

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateFields = () => {
    let newErrors = {};
    if (isSignup && !formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password.trim())
      newErrors.password = "Password cannot be empty!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = isSignup
        ? await signup(formData)
        : await login(formData);

      if (isSignup) {
        toast.success("Signup Successful! Please Verify your Email!");
        onClose();
        navigate(`/verify?email=${formData.email}`);
      } else {
        setIsLoggedIn(true);
        setUserData(response.user);
        toast.success("Login successful!");
        onClose();
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const formattedErrors = error.errors?.reduce((acc, curr) => {
        acc[curr.field] = curr.message;
        return acc;
      }, {});

      setErrors(formattedErrors || {});
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignup && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}

            {!isSignup && (
              <p className="fpass">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    onClose && onClose();
                    navigate("/forgetPassword");
                  }}
                >
                  Forgot Password?
                </span>
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>

            {errors.general && <span className="error">{errors.general}</span>}
          </form>

          <p className="toggle-text">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={toggleForm}>{isSignup ? "Login" : "Sign Up"}</span>
          </p>
        </div>
      </div>
    )
  );
}

export default AuthModal;
