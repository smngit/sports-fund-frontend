import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          phone_number: phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/contributions");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={phone}
          placeholder="Enter Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
