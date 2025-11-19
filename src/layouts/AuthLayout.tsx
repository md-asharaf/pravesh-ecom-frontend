import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (user) return <Navigate to="/profile" replace />;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 w-full flex justify-between items-center z-10">
        <Link to="/">
          <Button variant="outline" className="m-4">
            <ArrowLeft className="mr-1" />
            Home
          </Button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
