import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "./UserDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";

// Routes the logged-in user to the dashboard that matches their role
const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "manager") return <ManagerDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
