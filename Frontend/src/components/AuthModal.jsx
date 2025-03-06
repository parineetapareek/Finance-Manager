import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContent } from "../context/AppContext";
import { login, signup } from "../services/AuthService";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

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
      console.log("Error Object:", error); // Debugging line
      console.log("Error Response:", error.response); // Debugging line
    
      if (error.response) {
        // Server responded with an error (e.g., 400, 401, 500)
        const { errors, message } = error.response.data;
    
        if (errors && typeof errors === "object") { 
          // const newErrors = {};
          // errors.forEach((msg) => {
          //   if (msg.toLowerCase().includes("name")) newErrors.name = msg;
          //   if (msg.toLowerCase().includes("email")) newErrors.email = msg;
          //   if (msg.toLowerCase().includes("password")) newErrors.password = msg;
          // });
    
          // setErrors(newErrors);
          setErrors(errors);
          toast.error("Validation error! Check your inputs!");
        } else if (message) {
          setErrors({ message });
          toast.error(message);
        }
      } else if (error.request) {
        // No response received (network error)
        setErrors({ message: "Network error! Please check your connection." });
        toast.error("Network error! Please check your connection.");
      } else {
        // Other errors (e.g., Axios configuration error)
        setErrors({ message: error.message || "Something went wrong" });
        toast.error(error.message || "Something went wrong");
      }
    }
  };

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
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            {errors.name && <span className="error">{errors.name}</span>}

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
              <p className="fpass" onClick={() => navigate("/forgetPassword")}>
                <span>Forgot Password?</span>
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>

            {errors.message && <span className="error">{errors.message}</span>}
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
