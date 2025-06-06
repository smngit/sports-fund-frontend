import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Users() {
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserRole = user?.role || "member";

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    role: "member"
  });

  const [editData, setEditData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${API_BASE}/users`)
      .then((res) => setUsers(res.data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE}/users`, formData)
      .then(() => {
        setFormData({ name: "", phone_number: "", email: "", role: "member" });
        fetchUsers();
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      axios.delete(`${API_BASE}/users/${id}`)
        .then(() => fetchUsers());
    }
  };

  const openEditModal = (user) => {
    setEditData({ ...user });
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
    axios.put(`${API_BASE}/users/${editData.user_id}`, editData)
      .then(() => {
        closeEditModal();
        fetchUsers();
      });
  };

  return (
    <div>
      <h2>Users Page</h2>

      {/* Export */}
      {currentUserRole === "admin" && (
        <button
          onClick={() => window.open(`${API_BASE}/export/users`, "_blank")}
          style={{ marginBottom: "20px" }}
        >
          Export Users CSV
        </button>
      )}

      {/* Add User Form */}
      {currentUserRole === "admin" && (
        <form onSubmit={handleSubmit}>
          <h4>Add User</h4>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      )}

      <br />

      {/* Users Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.user_id}>
              <td>{index + 1}</td>
              <td>{u.name}</td>
              <td>{u.phone_number}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                {currentUserRole === "admin" && (
                  <>
                    <button onClick={() => openEditModal(u)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(u.user_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit User"
        style={{ content: { width: "400px", margin: "auto" } }}
      >
        <h3>Edit User</h3>
        {editData && (
          <form onSubmit={handleEditSubmit}>
            <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Name" required />
            <input name="phone_number" value={editData.phone_number} onChange={handleEditChange} placeholder="Phone Number" required />
            <input name="email" value={editData.email} onChange={handleEditChange} placeholder="Email" />
            <select name="role" value={editData.role} onChange={handleEditChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <select name="status" value={editData.status} onChange={handleEditChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

export default Users;
