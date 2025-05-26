import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Contributions() {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserRole = user?.role || "member";

  const [contributions, setContributions] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "", amount: "", date: "", month: ""
  });
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchContributions();
    fetchUsers();
  }, []);

  const fetchContributions = () => {
    let url = "http://localhost:5000/api/contributions";
    const params = [];
    if (filterUserId) params.push(`user_id=${filterUserId}`);
    if (filterMonth) params.push(`month=${encodeURIComponent(filterMonth)}`);
    if (params.length > 0) url += "?" + params.join("&");
    axios.get(url).then((res) => setContributions(res.data));
  };

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/contributions", formData)
      .then(() => {
        setFormData({ user_id: "", amount: "", date: "", month: "" });
        fetchContributions();
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this contribution?")) {
      axios.delete(`http://localhost:5000/api/contributions/${id}`)
        .then(() => fetchContributions());
    }
  };

  const openEditModal = (c) => {
    setEditData({ ...c });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.name === "user_id" ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/contributions/${editData.contribution_id}`, editData)
      .then(() => {
        closeEditModal();
        fetchContributions();
      });
  };

  return (
    <div>
      <h2>Contributions Page</h2>

      {/* Filter Section */}
      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid gray" }}>
        <h4>Filter Contributions</h4>
        <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)}>
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user.user_id} value={user.user_id}>{user.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Month (e.g. May 2025)"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <button onClick={fetchContributions}>Apply Filter</button>
        <button onClick={() => {
          setFilterUserId("");
          setFilterMonth("");
          fetchContributions();
        }}>Clear</button>
        <br /><br />
        {currentUserRole === "admin" && (
          <button onClick={() => window.open("http://localhost:5000/api/export/contributions", "_blank")}>
            Export Contributions CSV
          </button>
        )}
      </div>

      {/* Add Contribution Form */}
      {currentUserRole === "admin" && (
        <form onSubmit={handleSubmit}>
          <h4>Add Contribution</h4>
          <select name="user_id" value={formData.user_id} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.name}</option>
            ))}
          </select>
          <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
          <input name="date" value={formData.date} onChange={handleChange} placeholder="YYYY-MM-DD" required />
          <input name="month" value={formData.month} onChange={handleChange} placeholder="Month Year" required />
          <button type="submit">Add Contribution</button>
        </form>
      )}

      <br />

      {/* Contributions Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Month</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map(c => (
            <tr key={c.contribution_id}>
              <td>{c.contribution_id}</td>
              <td>{users.find(u => u.user_id === c.user_id)?.name || c.user_id}</td>
              <td>{c.amount}</td>
              <td>{c.date}</td>
              <td>{c.month}</td>
              <td>
                {currentUserRole === "admin" && (
                  <>
                    <button onClick={() => openEditModal(c)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(c.contribution_id)}>Delete</button>
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
        contentLabel="Edit Contribution"
        style={{ content: { width: "400px", margin: "auto" } }}
      >
        <h3>Edit Contribution</h3>
        {editData && (
          <form onSubmit={handleEditSubmit}>
            <select name="user_id" value={editData.user_id} onChange={handleEditChange} required>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>{user.name}</option>
              ))}
            </select>
            <input name="amount" value={editData.amount} onChange={handleEditChange} placeholder="Amount" required />
            <input name="date" value={editData.date} onChange={handleEditChange} placeholder="YYYY-MM-DD" required />
            <input name="month" value={editData.month} onChange={handleEditChange} placeholder="Month Year" required />
            <br /><br />
            <button type="submit">Update</button>{" "}
            <button onClick={closeEditModal}>Cancel</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default Contributions;
