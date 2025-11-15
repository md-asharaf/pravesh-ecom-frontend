import { useAuth } from "@/providers/auth";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const PrivateLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default PrivateLayout;
