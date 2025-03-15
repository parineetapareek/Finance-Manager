import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/TransactionServices";
import { getAuthUser } from "../services/AuthService";
import "../styles/account.css";
import { getAccountsByUser } from "../services/AccountService";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: 0,
    tranType: "Income",
    date: "",
    description: "",
    accountId: "",
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  useEffect(() => {
    const fetchUserIdAndAccounts = async () => {
      try {
        setError(null);
        const user = await getAuthUser();
        console.log("user: ", user);
        console.log("user.user._id: ", user.user._id);
        setUserId(user.user._id);

        const accountData = await getAccountsByUser(user.user._id);
        console.log("accountData: ", accountData);
        console.log("accountData.accounts: ", accountData.account);
        setAccounts(accountData.account);
      } catch (error) {
        console.error("Error fetching user ID or accounts:", error.message);
        setError("Failed to fetch user ID or accounts. Please try again.");
      }
    };
    fetchUserIdAndAccounts();
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!userId) return;
    setLoading(true);
    console.log("in fetch transaction");
    try {
      setError(null);
      const data = await getTransactions();
      console.log("data: ", data);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID is missing. Please try again.");
      toast.error("User ID is missing. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        ...newTransaction,
        userId,
        date: new Date(newTransaction.date).toISOString(),
      };

      console.log("Transaction Data: ", transactionData);
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await addTransaction(transactionData);
        toast.success("Transaction added successfully!");
      }

      setNewTransaction({
        category: "",
        amount: 0,
        tranType: "Income",
        date: "",
        description: "",
        accountId: "",
      });
      setEditingTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error.message);
      setError("Failed to save transaction. Please try again.");
      toast.error(error.message || "Error saving transaction!");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      category: transaction.category,
      amount: transaction.amount,
      tranType: transaction.tranType,
      date: new Date(transaction.date).toISOString().split("T")[0], // Format date for input
      description: transaction.description,
      accountId: transaction.accountId,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setNewTransaction({
      category: "",
      amount: 0,
      tranType: "Income",
      date: "",
      description: "",
      accountId: "",
    });
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = async (id) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully!");
      await fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
      setError("Failed to delete transaction. Please try again.");
      toast.error(error.message || "Error deleting transaction!");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting/deselecting a transaction
  const handleSelectTransaction = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(
        selectedTransactions.filter((txnId) => txnId !== id)
      );
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  // Handle selecting/deselecting all transactions
  const handleSelectAllTransactions = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map((txn) => txn._id));
    }
  };

  // Handle deleting multiple transactions
  const handleDeleteMultipleTransactions = async () => {
    if (selectedTransactions.length === 0) {
      toast.warning("No transactions selected!");
      return;
    }

    setLoading(true);
    try {
      await deleteMultipleTransactions(selectedTransactions);
      toast.success("Selected transactions deleted successfully!");
      setSelectedTransactions([]);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting multiple transactions:", error.message);
      setError("Failed to delete selected transactions. Please try again.");
      toast.error(error.message || "Error deleting selected transactions!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="transacMain">
        <SideNav />
        <div className="transacContent">
          <div className="tranInfo">
            <h2>Transactions</h2>

            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}

            {/* Delete Selected Button */}
            {selectedTransactions.length > 0 && (
              <button
                className="deleteSelectedBtn"
                onClick={handleDeleteMultipleTransactions}
                disabled={loading}
              >
                Delete Selected
              </button>
            )}

            {/* Transaction Table */}
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedTransactions.length === transactions.length
                      }
                      onChange={handleSelectAllTransactions}
                    />
                  </th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(txn._id)}
                          onChange={() => handleSelectTransaction(txn._id)}
                        />
                      </td>
                      <td>{txn.category}</td>
                      <td>₹{txn.amount}</td>
                      <td>{txn.tranType}</td>
                      <td>{new Date(txn.date).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleEdit(txn)}>Edit</button>
                        <button
                          onClick={() => handleDeleteTransaction(txn._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Transaction Form */}
          <div className="addTransaction">
            <h2>
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label>Category</label>
              <input
                type="text"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
                required
              />
              <label>Amount</label>
              <input
                type="number"
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: Number(e.target.value),
                    value: 0,
                  })
                }
                required
              />
              <label>Type</label>
              <select
                value={newTransaction.tranType}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    tranType: e.target.value,
                  })
                }
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <label>Date</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    date: e.target.value,
                  })
                }
                required
              />
              <label>Description</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
              />
              <label>Account</label>
              <select
                value={newTransaction.accountId}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    accountId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.bankName} (₹{account.bankBalance})
                  </option>
                ))}
              </select>
              <button type="submit">
                {loading
                  ? editingTransaction
                    ? "Updating..."
                    : "Adding..."
                  : editingTransaction
                  ? "Update Transaction"
                  : "Add Transaction"}
              </button>
              {editingTransaction && (
                <button type="button" onClick={handleCancelEdit}>
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;
