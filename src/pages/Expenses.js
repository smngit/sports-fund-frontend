import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

Modal.setAppElement("#root");

function Expenses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserRole = user?.role || "member";

  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    month: "",
    created_by: ""
  });

  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchUsers();
  }, []);

  const fetchExpenses = () => {
    let url = `${API_BASE}/expenses`;
    if (filterMonth) {
      url += `?month=${encodeURIComponent(filterMonth)}`;
    }
    axios.get(url).then((res) => setExpenses(res.data));
  };

  const fetchUsers = () => {
    axios.get(`${API_BASE}/users`).then((res) => setUsers(res.data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE}/expenses`, formData).then(() => {
      setFormData({
        description: "",
        amount: "",
        date: "",
        month: "",
        created_by: ""
      });
      fetchExpenses();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this expense?")) {
      axios.delete(`${API_BASE}/expenses/${id}`).then(() => fetchExpenses());
    }
  };

  const openEditModal = (e) => {
    setEditData({ ...e });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`${API_BASE}/expenses/${editData.expense_id}`, editData).then(() => {
      closeEditModal();
      fetchExpenses();
    });
  };

  return (
    <div>
      <h2>Expenses Page</h2>

      {/* Filter + Export */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid gray" }}>
        <h4>Filter Expenses</h4>
        <input
          type="text"
          placeholder="Month (e.g. May 2025)"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <button onClick={fetchExpenses}>Apply Filter</button>
        <button onClick={() => { setFilterMonth(""); fetchExpenses(); }}>Clear</button>
        <br /><br />
        {currentUserRole === "admin" && (
          <button
            onClick={() => window.open(`${API_BASE}/export/expenses`, "_blank")}
            style={{ marginTop: "10px" }}
          >
            Export Expenses CSV
          </button>
        )}
      </div>

      {/* Add Expense Form */}
      {currentUserRole === "admin" && (
        <form onSubmit={handleSubmit}>
          <h4>Add Expense</h4>
          <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
          <input name="date" value={formData.date} onChange={handleChange} placeholder="YYYY-MM-DD" required />
          <input name="month" value={formData.month} onChange={handleChange} placeholder="Month Year" required />
          <select name="created_by" value={formData.created_by} onChange={handleChange} required>
            <option value="">Created By</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.name}</option>
            ))}
          </select>
          <button type="submit">Add Expense</button>
        </form>
      )}

      <br />

      {/* Expense Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Month</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.expense_id}>
              <td>{e.expense_id}</td>
              <td>{e.description}</td>
              <td>{e.amount}</td>
              <td>{e.date}</td>
              <td>{e.month}</td>
              <td>{users.find(u => u.user_id === e.created_by)?.name || e.created_by}</td>
              <td>
                {currentUserRole === "admin" && (
                  <>
                    <button onClick={() => openEditModal(e)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(e.expense_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Expense"
        style={{ content: { width: "400px", margin: "auto" } }}
      >
        <h3>Edit Expense</h3>
        {editData && (
          <form onSubmit={handleEditSubmit}>
            <input name="description" value={editData.description} onChange={handleEditChange} placeholder="Description" required />
            <input name="amount" value={editData.amount} onChange={handleEditChange} placeholder="Amount" required />
            <input name="date" value={editData.date} onChange={handleEditChange} placeholder="YYYY-MM-DD" required />
            <input name="month" value={editData.month} onChange={handleEditChange} placeholder="Month Year" required />
            <select name="created_by" value={editData.created_by} onChange={handleEditChange} required>
              <option value="">Created By</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
            </select>
            <br /><br />
            <button type="submit">Update</button>{" "}
            <button onClick={closeEditModal}>Cancel</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Expenses;
