import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Users from "./pages/Users";
import Contributions from "./pages/Contributions";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Optional: Can be used in axios or other API calls
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Navigation() {
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/login";
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    !hideNav && (
      <>
        <h1>Sports Fund Manager</h1>
        <nav>
          <span>Welcome, {user?.name}</span> |{" "}
          <Link to="/users">Users</Link> |{" "}
          <Link to="/contributions">Contributions</Link> |{" "}
          <Link to="/expenses">Expenses</Link> |{" "}
          <Link to="/summary">Summary</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </>
    )
  );
}

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contributions"
            element={
              <ProtectedRoute>
                <Contributions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
