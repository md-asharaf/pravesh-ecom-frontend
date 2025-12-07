import Footer from "@/components/Footer";
import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/providers/auth";
import { categoryService } from "@/services/category.service";
import { settingsService } from "@/services/settings.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategoryTree } from "@/store/slices/category";
import { setSettings } from "@/store/slices/settings";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { loading } = useAuth();
  const wishlistCount = useAppSelector((s) => s.wishlist.totalItems);
  const cartCount = useAppSelector((s) => s.cart.totalItems);
  const { tree } = useAppSelector((s) => s.categoryTree);
  const settings = useAppSelector((s) => s.settings.settings);
  const dispatch = useAppDispatch();
  const { data, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category-tree"],
    queryFn: async () => {
      const res = await categoryService.getTree();
      return res.data;
    },
    enabled: tree.length === 0,
  });

  const { data: settingsData,isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await settingsService.get();
      return res.data;
    },
    enabled: !settings,
    retry: false,
  });

  useEffect(() => {
    if (data && data.length > 0) dispatch(setCategoryTree(data));
  }, [data, dispatch]);

  useEffect(() => {
    if (settingsData) dispatch(setSettings(settingsData));
  }, [settingsData, dispatch]);

  if (loading || isCategoryLoading || isSettingsLoading) return <Loader />

  return (
    <div className="bg-background flex flex-col min-h-screen">
      <Navbar wishlistCount={wishlistCount} cartCount={cartCount} tree={tree} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
