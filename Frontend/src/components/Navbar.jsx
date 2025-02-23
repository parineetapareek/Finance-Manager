import React, { useEffect, useState } from "react";

function Navbar() {
  const[sticky, setSticky] = useState(false);
  useEffect(()=>{
    const handleScroll = () => {
      if (window.scrollY>0){
        setSticky(true);
      }else{
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return()=>{
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${sticky ? "fixed-top shadow bg-light text-dark transition-all duration-300":""}`}>
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
            <a className="navbar-brand order-1 ms-3 agbalumo-regular d-flex align-items-center" href="#">
              ReFina
            </a>
          </div>

          <div
            className="collapse navbar-collapse nvm"
            id="navbarSupportedContent"
          >
            <div className="ln">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <button type="button" className="btn btn-outline-dark">
            Sign Up
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
