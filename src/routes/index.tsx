import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Index from "@/pages/public/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Products from "@/pages/public/Products";
import ProductDetail from "@/pages/public/ProductDetail";
import Wishlist from "@/pages/private/Wishlist";
import Cart from "@/pages/private/Cart";
import Checkout from "@/pages/private/Checkout";
import Categories from "@/pages/public/Categories";
import Brands from "@/pages/public/Brands";
import Blog from "@/pages/public/Blog";
import BlogDetail from "@/pages/public/BlogDetail";
import Orders from "@/pages/private/Orders";
import OrderDetails from "@/pages/private/OrderDetails";
import Profile from "@/pages/private/Profile";
import NotFound from "@/pages/NotFound";
import PrivateLayout from "@/layouts/PrivateLayout";
import Addresses from "@/pages/private/Addresses";
import AuthLayout from "@/layouts/AuthLayout";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
};

export default AppRoutes;
