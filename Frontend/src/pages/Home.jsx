import React from "react";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <>
      <div className="main">
        <div className="left">
          <img src="homeFinal.png" />
        </div>
        <div className="right">
          <h1 className="signika-negative-regular">ReFina- Finances Redefined!</h1>
          <h3 className="cormorant-infant-medium">
            Smart Money. Smarter You.
          </h3>
          <p>Transform the way you manage money with effortless tracking, visual insights, and goal-based budgeting.
          Whether you're saving, investing, or managing expenses, take full control and make every rupee count!</p>
          <button type="button" className="btn"
          style={{ border: "2px solid #CE93D8", color: "#CE93D8" }}>
            Get Started
          </button>
        </div>
      </div>
      <div className="ftr">
        <h1 className="signika-negative-regular"> Why Choose Us?</h1>
        <div className="cf">
          <FeatureCard />
        </div>
      </div>
    </>
  );
}

export default Home;
