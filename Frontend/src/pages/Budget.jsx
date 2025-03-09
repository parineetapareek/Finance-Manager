import React from "react";
import SideNav from "../components/SideNav";
import "../styles/budgetstyles.css";

function Budget() {
  return (
    <>
      <div className="mainBudget">
        <SideNav />
        <div className="budgetContainer">
          <h1>Wanted to implement but got university midsem!</h1>
          <h1>🛠 Budget Page Functionality - ReFina</h1>
          <ul>
            <li>📌 Budget Plan Selection Users can choose from:</li>
            <ul>
              <li>
                50/30/20 Rule - 50% Needs (Essentials: rent, groceries,
                utilities, insurance) 30% Wants (Entertainment, shopping,
                dining, hobbies) 20% Savings (Investments, emergency funds, debt
                repayment)
              </li>
              <li>
                60/30/20 Rule 60% Needs (Higher allocation for necessities:
                rent, food, bills) 30% Savings (Increased focus on financial
                security) 20% Wants (Limited spending on non-essential lifestyle
                choices)
              </li>
              <li>
                40/30/20/10 Rule 40% Needs (Lower allocation for essentials) 30%
                Investments (Stocks, mutual funds, retirement planning) 20%
                Savings (Emergency fund, debt repayment, future goals) 10% Wants
                (Minimal discretionary spending)
              </li>
              <li>
                Custom Budget Plan Users define their own percentage allocations
                Ability to switch plans anytime or lock for a period (e.g., one
                month)
              </li>
            </ul>
            <li>📌 Income Entry Users input monthly income (Salary, Freelance,
          Business, etc.) System auto-calculates category limits based on
          selected plan</li>
          <li>📌 Budget Breakdown & Visualization Displays allocated
          amounts for each category Progress bars or pie charts to show spending
          vs. remaining balance Example (50/30/20 Plan, Income: ₹50,000):
          ₹25,000 → Needs ₹15,000 → Wants ₹10,000 → Savings/Investments</li>
          <li> 📌Expense Tracking & Auto-Updates Users log daily expenses, system
          auto-adjusts remaining budget Auto-categorization of expenses (Food,
          Transport, Entertainment, etc.) Alerts for overspending (e.g., "⚠️
          You've exceeded your Wants budget!")</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Budget;
