import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
