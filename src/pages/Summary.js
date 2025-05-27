import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Summary() {
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const [contribRes, expenseRes] = await Promise.all([
        axios.get(`${API_BASE}/contributions`),
        axios.get(`${API_BASE}/expenses`)
      ]);

      const collected = contribRes.data.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      );
      const spent = expenseRes.data.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      );

      setTotalCollected(collected);
      setTotalSpent(spent);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  return (
    <div>
      <h2>Summary</h2>
      <table border="1" cellPadding="10">
        <tbody>
          <tr>
            <td><strong>Total Collected</strong></td>
            <td>₹{totalCollected}</td>
          </tr>
          <tr>
            <td><strong>Total Spent</strong></td>
            <td>₹{totalSpent}</td>
          </tr>
          <tr>
            <td><strong>Balance</strong></td>
            <td>₹{totalCollected - totalSpent}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Summary;
