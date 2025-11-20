import Footer from "@/components/Footer";
import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/providers/auth";
import { categoryService } from "@/services/category.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategoryTree } from "@/store/slices/category";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { loading } = useAuth();
  const wishlistCount = useAppSelector((s) => s.wishlist.totalItems);
  const cartCount = useAppSelector((s) => s.cart.totalItems);
  const { tree } = useAppSelector((s) => s.categoryTree);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useQuery({
    queryKey: ["category-tree"],
    queryFn: async () => {
      const res = await categoryService.getTree();
      return res.data;
    },
    enabled: tree.length === 0,
  });

  useEffect(() => {
    if (data) dispatch(setCategoryTree(data));
  }, [data, dispatch]);
  if (loading || isLoading) return <Loader />

  return (
    <div className="bg-background flex flex-col min-h-screen">
      <div className="min-h-screen bg-background">
        <Navbar wishlistCount={wishlistCount} cartCount={cartCount} tree={tree} />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
