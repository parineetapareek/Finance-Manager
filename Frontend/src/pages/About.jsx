import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

function About() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <div className="about">
        <div className="abtMain">
          <div className="abtL">
            <img src="abtFinal.png" />
          </div>
          <div className="abtR">
            <h1>
              Worried About Managing Your Finances? <span> We Got You!</span>
            </h1>
            <p>
              Managing finances shouldn't be complicated. Our mission is to
              simplify money management, helping individuals make informed
              financial decisions effortlessly. We empower users with a secure,
              seamless platform to track, budget, and plan their financial
              future.
            </p>
          </div>
        </div>

        <div className="abtCard">
          <div className="contentL">
            <h1>Who We Help?</h1>
            <ul>
              <li>Students Managing Allowances</li>
              <li>Working Professionals Tracking Income and Expences</li>
              <li>Families Planning Household Budgets</li>
            </ul>
          </div>
          <div className="cimgR">
            <img src="abt2.png" />
          </div>
        </div>

        <div className="abtCard">
          <div className="cimgL">
            <img src="abt3.png" />
          </div>
          <div className="contentR">
            <h1>What Makes Us Different?</h1>
            <ul>
              <li>
                <span>Visual Insights: </span>We Provide you graphical
                representation to visualize your finances more accurately.
              </li>
              <li>
                <span>Comprehensive Features: </span> Covers budgeting,
                investments, savings, and debt management all in one place.
              </li>
              <li>
                <span>Smart Budgeting Rules: </span> Our platform helps you
                spend wisely with smart budgeting techniques, ensuring financial
                stability.
              </li>
            </ul>
          </div>
        </div>

        <div className="abtCard">
          <div className="contentL">
            <h1>Why I Built This?</h1>
            <p>
              Managing money shouldn't feel like solving a puzzle. I built
              Personal Finance Manager because I wanted a simple, effective way
              to track income, expenses, and investments—without drowning in
              spreadsheets or complicated tools. Whether you're saving for a
              goal, budgeting better, or just trying to understand where your
              money goes, this platform is designed to make financial management
              effortless.
            </p>
          </div>
          <div className="cimgR">
            <img src="abt4.png" />
          </div>
        </div>

        <div className="abtCard">
          <div className="cimgL">
            <img src="abt5.png" />
          </div>
          <div className="contentR">
            <h1>Shape the Future of Finance Management</h1>
            <p>
              This project is constantly evolving to help people take control of
              their finances with ease. Your feedback, ideas, and suggestions
              matter! If you have thoughts on how to improve the platform, feel
              free to reach out. Together, we can make personal finance simpler
              for everyone.
            </p>

            <button
              type="button"
              className="btn"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Get Started
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

export default About;
