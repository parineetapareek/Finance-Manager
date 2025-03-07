import React from "react";
import SideNav from "../components/SideNav";
import "../styles/budgetstyles.css";

function Budget() {
  return (
    <>
      <div className="mainBudget">
        <SideNav />
        <div className="budgetContainer"></div>
      </div>
    </>
  );
}

export default Budget;
