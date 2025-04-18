import React from "react";
import { Link } from "react-router-dom";
import "../styles/sideNavStyle.css";

function SideNav() {
  return (
    <>
      <div className="sideNav">
        <ul>
          <li>
            <img src="dash.svg" />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          {/* <li>
            <img src="account.svg" />
            <Link to="/account">Accounts</Link>
          </li> */}
          <li>
            <img src="wallet.svg" />
            <Link to="/account">Accounts</Link>
          </li>
          <li>
            <img src="transaction.svg" />
            <Link to="/transaction">Transactions</Link>
          </li>
          <li>
            <img src="budget.svg" />
            <Link to="/budget">Budget</Link>
          </li>
          <li>
            <img src="moneybag.svg" />
            <Link to="/savings">Savings</Link>
          </li>
          <li>
            <img src="investment.svg" />
            <Link to="/investment">Investments</Link>
          </li>
          <li>
            <img src="debt.svg" />
            <Link to="/debt">Debts</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SideNav;
