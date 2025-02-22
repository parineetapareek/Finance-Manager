import React from "react";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <>
      <div className="main">
        <div className="left">
            <img src="girlManaging-UI.jpg"/>
        </div>
        <div className="right">
            <h1>Finage: Take your Finances under control- <span>Anytime, Anywhere</span></h1>
            <p>FinAge Provides you a virtual planner for your finances.
            </p>
            <button type="button" className="btn btn-outline-info">Get Started</button>
            </div>
      </div>
      <div className="ftr">
        <h1>Why Choose Us?</h1>
        <FeatureCard/>
      </div>
    </>
  );
}

export default Home;
