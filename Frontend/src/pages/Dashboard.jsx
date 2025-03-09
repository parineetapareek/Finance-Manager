import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import "../styles/dashboard.css";
import { getAuthUser } from "../services/AuthService";
import { getAccountsByUser } from "../services/AccountService";
import { getTransactions } from "../services/TransactionServices";

function Dashboard() {
  const [totalBankBalance, setTotalBankBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the authenticated user
        const user = await getAuthUser();
        const userId = user.user._id;

        // Fetch accounts to calculate total bank balance
        const accountsData = await getAccountsByUser(userId);
        const totalBalance = accountsData.account.reduce(
          (sum, account) => sum + account.bankBalance,
          0
        );
        setTotalBankBalance(totalBalance);

        // Fetch transactions to calculate total income and spending
        const transactionsData = await getTransactions();
        const income = transactionsData.transactions
          .filter((txn) => txn.tranType === "Income")
          .reduce((sum, txn) => sum + txn.amount, 0);
        const spending = transactionsData.transactions
          .filter((txn) => txn.tranType === "Expense")
          .reduce((sum, txn) => sum + txn.amount, 0);

        setTotalIncome(income);
        setTotalSpending(spending);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mainDash">
        <SideNav />
        <div className="mainContentDash">
          <h1>Dashboard</h1>
          {error && <p className="error">{error}</p>}
          {loading && <p>Loading...</p>}
          <div className="review">
            <div className="boxR">
              Total Bank Balance
              <p>₹{totalBankBalance.toFixed(2)}</p>
            </div>
            <div className="boxR">
              Total Income
              <p>₹{totalIncome.toFixed(2)}</p>
            </div>
            <div className="boxR">
              Total Spending
              <p>₹{totalSpending.toFixed(2)}</p>
            </div>
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
