import React from "react";
import SideNav from "../components/SideNav";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <>
      <div className="mainDash">
        <SideNav />
        <div className="mainContentDash">
          <h1>Dashboard</h1>
          <div className="review">
            <div className="boxR">Bank Balance</div>
            <div className="boxR">Income this month</div>
            <div className="boxR">Spendings</div>
            <div className="boxR">Savings</div>
            <div className="boxR">Investments</div>
            <div className="boxR">Total Debts</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
