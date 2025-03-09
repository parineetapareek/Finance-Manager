import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { getAuthUser } from "../services/AuthService";
import {
  createAccount,
  deleteAccount,
  getAccountsByUser,
  updateAccountBalance,
} from "../services/AccountService";
import "../styles/account.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Account() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountType: "Savings",
    bankBalance: 0,
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setError(null);
        const user = await getAuthUser();
        setUserId(user.user._id);
      } catch (error) {
        console.error("Error fetching user ID:", error.message);
        setError("Failed to fetch user ID. Please try again.");
      }
    };

    fetchUserId();
  }, []);

  const fetchAccounts = async () => {
    console.log("userID in fetch accounts: ", userId);

    if (!userId) return;

    setLoading(true);
    try {
      setError(null);
      const data = await getAccountsByUser(userId);
      console.log("fetch accounts: ", data);
      console.log("data.accounts: ", data.account);
      setAccounts(data.account);
    } catch (error) {
      console.error("Error fetching accounts:", error.message);
      setError("Failed to fetch accounts. Please try again.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID is missing. Please try again.");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      await createAccount({ ...newAccount, userId });
      setNewAccount({ bankName: "", accountType: "Savings", bankBalance: 0 });
      toast.success("Account Created Successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error.message);
      setError("Failed to create account. Please try again.");
      toast.error("Error Creating Account!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (accId, amount, operation) => {
    console.log("accId: ", accId);
    console.log("amount: ", amount);
    console.log("operation: ", operation);

    if (!accId || !amount || amount < 0) {
      setError("Invalid input for updating balance.");
      return;
    }

    setLoading(true);
    try {
      const finalOperation = operation || "add";
      console.log("final Operation: ", finalOperation);
      await updateAccountBalance(accId, amount, finalOperation);
      toast.success("Account Updated Successfully!");
      fetchAccounts(); // Refresh account list
    } catch (error) {
      console.error("Error updating balance:", error.message);
      setError("Failed to update balance. Please try again.");
      toast.error("Error Updating Account!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accId) => {
    if (!accId) {
      setError("Invalid account ID.");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      await deleteAccount(accId);
      toast.success("Account Deleted Successfully!");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error.message);
      setError("Failed to delete account. Please try again.");
      toast.error("Error Deleting Account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accMain">
      <SideNav />
      <div className="accContent">
        <div className="accInfo">
          <h2>Accounts</h2>

          {error && <p className="error">{error}</p>}

          {loading && <p>Loading...</p>}
          <table>
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts?.length > 0 ? (
                accounts.map((acc) => (
                  <tr key={acc._id}>
                    <td>{acc.bankName}</td>
                    <td>{acc.accountType}</td>
                    <td>${acc.bankBalance}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={acc.amount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAccounts((prev) =>
                            prev.map((a) =>
                              a._id === acc._id ? { ...a, amount: value } : a
                            )
                          );
                        }}
                      />
                      <select
                        value={acc.operation || "add"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAccounts((prev) =>
                            prev.map((a) =>
                              a._id === acc._id ? { ...a, operation: value } : a
                            )
                          );
                        }}
                      >
                        <option value="add">Add</option>
                        <option value="sub">Subtract</option>
                      </select>
                      <button
                        onClick={() =>
                          handleUpdateBalance(
                            acc._id,
                            Number(acc.amount),
                            acc.operation
                          )
                        }
                      >
                        Update
                      </button>{" "}
                      <button onClick={() => handleDeleteAccount(acc._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="createAcc">
          <h2>Create Account</h2>
          <form onSubmit={handleCreateAccount}>
            <label>Bank Name</label>
            <input
              type="text"
              value={newAccount.bankName}
              onChange={(e) =>
                setNewAccount({ ...newAccount, bankName: e.target.value })
              }
              required
            />
            <label>Account Type</label>
            <select
              value={newAccount.accountType}
              onChange={(e) =>
                setNewAccount({ ...newAccount, accountType: e.target.value })
              }
            >
              <option value="Savings">Savings</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Other">Other</option>
            </select>
            <label>Initial Balance</label>
            <input
              type="number"
              value={newAccount.bankBalance}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  bankBalance: Number(e.target.value),
                })
              }
              required
            />
            <button type="submit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
