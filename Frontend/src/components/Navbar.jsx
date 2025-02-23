import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

function Navbar() {
  const [sticky, setSticky] = useState(false);
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

  const [modalOpen, setModalOpen] = useState(false);

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
          <button
            onClick={() => setModalOpen(true)}
            type="button"
            className="btn btn-outline-dark"
          >
            Sign Up
          </button>
          <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
