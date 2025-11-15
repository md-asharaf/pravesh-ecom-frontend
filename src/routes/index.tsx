import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Categories from "@/pages/Categories";
import Brands from "@/pages/Brands";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import PrivateLayout from "@/layouts/PrivateLayout";
import Addresses from "@/pages/Addresses";

const AppRoutes = () => {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/brands" element={<Brands />} />
    </Route>

    <Route element={<PrivateLayout />}>
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/addresses" element={<Addresses />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

  );
};

export default AppRoutes;
