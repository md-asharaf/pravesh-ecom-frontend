import { useAuth } from "@/providers/auth";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useEffect } from "react";
import { setCategoryTree } from "@/store/slices/category";

const PrivateLayout = () => {
  const { user, loading } = useAuth();

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

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} tree={tree} />
      <Outlet />
    </div>
  );
}

export default PrivateLayout;
