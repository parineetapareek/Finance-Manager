import React, { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import "../styles/account.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBudget,
  deleteBudget,
  getBudget,
  updateBudget,
} from "../services/BudgetService";
import { getAuthUser } from "../services/AuthService";

function Budget() {
  const [budget, setBudget] = useState(null);
  const [income, setIncome] = useState("");
  const [planType, setPlanType] = useState("50/30/20");
  const [isLocked, setIsLocked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [customAllocations, setCustomAllocations] = useState({});

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      try {
        const user = await getAuthUser();
        if (!user?.user?._id) throw new Error("User not authenticated.");
        setUserId(user.user._id);
        console.log("user: ", user);
        console.log("user.user._id: ", user.user._id);

        const response = await getBudget(user.user._id);
        if (response.success) {
          setBudget(response.budget);
          setIncome(response.budget.income);
          setPlanType(response.budget.planType);
          setIsLocked(response.budget.isLocked);
          setStartDate(response.budget.startDate.split("T")[0]);

          if (response.budget.planType === "Custom") {
            const customAllocationsPercentage = {};
            for (const [category, fraction] of Object.entries(
              response.budget.customAllocations || {}
            )) {
              customAllocationsPercentage[category] =
                Math.round(fraction * 100 * 100) / 100;
              console.log(
                "customAllocationsPercentage: ",
                customAllocationsPercentage
              );
            }
            setCustomAllocations(customAllocationsPercentage);
          }
        }
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);

  const handleCustomAllocationsChange = (category, value) => {
    setCustomAllocations((prev) => ({
      ...prev,
      [category]: value ? Math.max(0, Math.min(100, Number(value))) : "",
    }));
  };

  const handleCustomCategoryChange = (oldCategory, newCategory) => {
    setCustomAllocations((prev) => {
      const updated = { ...prev };
      delete updated[oldCategory];
      updated[newCategory] = prev[oldCategory];
      return updated;
    });
  };

  const addCustomAllocation = () => {
    setCustomAllocations((prev) => ({
      ...prev,
      [`Category ${Object.keys(prev).length + 1}`]: "",
    }));
  };

  const removeCustomAllocation = (category) => {
    setCustomAllocations((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const calculateTotalAllocation = () => {
    return Object.values(customAllocations).reduce(
      (acc, val) => acc + Number(val || 0),
      0
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert custom allocation percentages to fractions
    const customAllocationsFraction = {};
    if (planType === "Custom") {
      for (const [category, percentage] of Object.entries(customAllocations)) {
        customAllocationsFraction[category] = parseFloat(percentage) / 100;
        console.log("customAllocationsPercentage: ", customAllocationsFraction);
      }
    }

    if (planType === "Custom" && calculateTotalAllocation() > 100) {
      setError("Total allocation percentage cannot exceed 100%.");
      setLoading(false);
      return;
    }

    const budgetData = {
      userId,
      income: Number(income),
      planType,
      isLocked,
      startDate,
      customAllocations:
        planType === "Custom" ? customAllocationsFraction : undefined,
    };

    console.log("budgetData: ", budgetData);

    try {
      let response;
      if (budget) {
        response = await updateBudget(budgetData);
        toast.success("Budget updated successfully!");
      } else {
        response = await createBudget(budgetData);
        toast.success("Budget created successfully!");
      }
      setBudget(response.budget);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle budget deletion
  const handleDelete = async () => {
    if (!budget) return;

    setLoading(true);
    setError("");

    try {
      await deleteBudget(budget._id);
      toast.success("Budget deleted successfully!");
      setBudget(null); // Reset the budget state
      setIncome("");
      setPlanType("50/30/20");
      setIsLocked(false);
      setStartDate("");
      setCustomAllocations({});
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAllocations = (allocations) => {
    if (!allocations || Object.keys(allocations).length === 0)
      return <div>No allocations available.</div>;

    return Object.entries(allocations).map(([category, amount]) => (
      <div key={category}>
        <strong>{category}:</strong> ₹{amount}
      </div>
    ));
  };

  return (
    <>
      <div className="mainBudget">
        <SideNav />
        <div className="budgetContainer">
          {error && <p className="error">{error}</p>}
          {loading && <p>Loading...</p>}

          <div className="addBudget">
            <form onSubmit={handleSubmit}>
              <label>Your Income: </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                disabled={loading || (budget && budget.isLocked)}
              />

              <label>Select Budget Plan</label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                disabled={loading || (budget && budget.isLocked)}
              >
                <option value="50/30/20">50/30/20</option>
                <option value="60/30/10">60/30/10</option>
                <option value="40/30/20/10">40/30/20/10</option>
                <option value="Custom">Custom</option>
              </select>

              {planType === "Custom" && (
                <div className="customAllocations">
                  <h4>Custom Allocations</h4>
                  {Object.entries(customAllocations).map(
                    ([category, value], index) => (
                      <div key={index} className="allocationItem">
                        <input
                          type="text"
                          placeholder="Category Name"
                          value={category}
                          onChange={(e) =>
                            handleCustomCategoryChange(category, e.target.value)
                          }
                          disabled={loading || (budget && budget.isLocked)}
                        />

                        <input
                          type="number"
                          placeholder="Percentage"
                          value={value || ""}
                          onChange={(e) =>
                            handleCustomAllocationsChange(
                              category,
                              e.target.value
                            )
                          }
                          disabled={loading || (budget && budget.isLocked)}
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomAllocation(category)}
                          disabled={loading || (budget && budget.isLocked)}
                        >
                          ❌
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={addCustomAllocation}
                    disabled={loading || (budget && budget.isLocked)}
                  >
                    ➕ Add Allocation
                  </button>
                  <p>
                    <strong>
                      Total Allocation: {calculateTotalAllocation()}%
                    </strong>
                  </p>
                  {calculateTotalAllocation() > 100 && (
                    <p style={{ color: "red" }}>
                      Total percentage cannot exceed 100%.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label>Lock Budget?</label>
                <label>Yes</label>
                <input
                  type="radio"
                  name="lockStatus"
                  checked={isLocked}
                  onChange={() => setIsLocked(true)}
                  disabled={loading}
                />
                <label>No</label>
                <input
                  type="radio"
                  name="lockStatus"
                  checked={!isLocked}
                  onChange={() => setIsLocked(false)}
                  disabled={loading}
                />
              </div>

              <label>Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={loading || (budget && budget.isLocked)}
              />

              <button
                type="submit"
                disabled={loading || (budget && budget.isLocked)}
              >
                {budget ? "Update Budget" : "Create Budget"}
              </button>
            </form>
          </div>

          {budget && (
            <div className="budgetInfo">
              <h2>Budget Details</h2>
              <div>
                <strong>Income:</strong> ₹{budget.income}
              </div>
              <div>
                <strong>Plan Type:</strong> {budget.planType}
              </div>
              <div>
                <strong>Allocations:</strong>
                {formatAllocations(budget.allocations)}
              </div>
              <div>
                <strong>Remaining Budget:</strong>
                {formatAllocations(budget.remainingBudget)}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {new Date(budget.startDate).toLocaleDateString()}
              </div>
              <button onClick={handleDelete} disabled={loading}>
                Delete Budget
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Budget;
