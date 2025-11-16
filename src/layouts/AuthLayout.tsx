import { Loader } from "@/components/Loader";
import { useAuth } from "@/providers/auth";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user) return <Navigate to="/profile" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
