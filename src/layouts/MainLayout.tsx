import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-background flex flex-col min-h-screen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
