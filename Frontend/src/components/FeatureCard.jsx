import React from "react";

function FeatureCard() {
  const features = [
    {
      img: "ieTrack.jpg",
      title: "Income & Expense Tracking",
      description: "Easily log and categorize your daily transactions",
    },
    {
      img: "budgetM.jpg",
      title: "Budget Management",
      description:
        "Set budgets, track spending, and stay on top of your financial goals",
    },
    {
      img: "savingW.jpg",
      title: "Savings & Goal Tracking",
      description: "Set financial goals and monitor your progress effortlessly",
    },
    {
      img: "dashboard.jpg",
      title: "Financial Reports & Insights",
      description: "Get Visual Insights with charts & reports",
    },
    {
      img: "investment.jpg",
      title: "Investment Tracking",
      description: "Track stocks, mutual funds & crypto holdings in real-time",
    },
    {
      img: "womenSaving.jpg",
      title: "Debt Management",
      description: "Plan and track loans, EMI schedules, and credit card dues.",
    },
  ];
  return (
    <>
      <div className="cardMine">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <img
              src={feature.img}
              className="card-img-top"
              alt={feature.title}
            />
            <div className="card-body">
              <h2 className="cormorant-infant-medium">{feature.title}</h2>
              <p className="card-text">{feature.description} </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FeatureCard;
