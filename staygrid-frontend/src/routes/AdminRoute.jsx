import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const isAdmin =
    user?.roles?.includes("HOTEL_MANAGER");

  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

export default AdminRoute;