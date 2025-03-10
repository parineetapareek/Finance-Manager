import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "../styles/navbar.css";
import { AppContent } from "../context/AppContext";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { isLoggedIn, userData, handleLogout } = useContext(AppContent);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          sticky
            ? "fixed-top shadow bg-light text-dark transition-all duration-300"
            : ""
        }`}
      >
        <div className="container-fluid d-flex justify-content-between w-100">
          <div className="d-flex align-items-center ">
            <button
              className="navbar-toggler ms-2 order-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link
              className="navbar-brand order-1 ms-3 agbalumo-regular d-flex align-items-center"
              to="/"
            >
              ReFina
            </Link>
          </div>

          <div
            className="collapse navbar-collapse nvm"
            id="navbarSupportedContent"
          >
            <div className="ln">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/about"
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="dropdown">
              <button
                className="btn profile-button"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userData?.name?.charAt(0).toUpperCase() || "P"}{" "}
                {/* Display user's initial */}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/verify">
                    Verify Account
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              type="button"
              className="btn btn-outline-dark"
            >
              Sign Up
            </button>
          )}
          <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
