import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import VerifyEmail from "./components/VerifyEmail";
import ForgetPassword from "./components/ForgetPassword";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Debt from "./pages/Debt";
import Income from "./pages/Income";
import Investment from "./pages/Investment";
import Savings from "./pages/Savings";
import Spending from "./pages/Spending";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/debt" element={<Debt />} />
        <Route path="/income" element={<Income />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/spending" element={<Spending />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
