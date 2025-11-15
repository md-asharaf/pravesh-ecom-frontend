import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Heart, Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const wishlistCount = useSelector((state: RootState) => state.wishlist.totalItems);
  const cartCount = useSelector((state: RootState) => state.cart.totalItems);

  // Fetch category tree
  const { data: categories = [] } = useQuery({
    queryKey: ["category-tree"],
    queryFn: async () => (await categoryService.getTree()).data,
  });

  if (loading)
    return (
      <div className="h-16 w-full border-b flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
      </div>
    );

  return (
    <>
      <nav className="w-full bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between gap-6">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
              <img src="https://img.freepik.com/premium-vector/white-logo-construction-project-called-construction_856308-794.jpg?semt=ais_hybrid&w=740&q=80" className="h-14 w-auto" />
              <span className="text-xl font-bold">Pravesh</span>
            </Link>

            {/* SEARCH BAR — DESKTOP */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  placeholder="Search for products, categories or brands"
                  className="h-12 pl-12 rounded-full bg-gray-100"
                  onChange={(e) => navigate(`/products?s=${e.target.value}`)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* RIGHT SIDE — DESKTOP */}
            <div className="hidden md:flex items-center gap-4">

              {/* ACCOUNT */}
              {user ? (
                <Button
                  variant="outline"
                  className="h-12 px-5 rounded-xl flex items-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-5 w-5" />
                  Account
                </Button>
              ) : (
                <Button variant="outline" asChild className="h-12 px-5 rounded-xl">
                  <Link to="/login">Login</Link>
                </Button>
              )}

              {/* WISHLIST */}
              <Button
                variant="outline"
                asChild
                className="h-12 px-5 rounded-xl flex items-center gap-2 relative"
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  Wishlist
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                </Link>
              </Button>

              {/* CART */}
              <Button
                variant="outline"
                asChild
                className="h-12 px-5 rounded-xl flex items-center gap-2 relative"
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                </Link>
              </Button>
            </div>

            {/* ================= MOBILE NAVIGATION ================= */}
            <div className="flex md:hidden items-center gap-3">

              {/* Mobile Search Button */}
              <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
              </Button>

              {/* Mobile Cart */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </Button>

              {/* Drawer */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="p-4 w-72">

                  <div className="space-y-6 mt-10">

                    {/* User */}
                    {user ? (
                      <SheetClose asChild>
                        <div
                          onClick={() => navigate("/profile")}
                          className="cursor-pointer"
                        >
                          <p className="text-lg font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link to="/login">Login</Link>
                        </Button>
                      </SheetClose>
                    )}

                    {/* Quick links */}
                    <SheetClose asChild><Link to="/orders">My Orders</Link></SheetClose>
                    <SheetClose asChild><Link to="/wishlist">Wishlist</Link></SheetClose>

                    <hr />

                    {/* Category Accordion */}
                    <Accordion type="single" collapsible>
                      {categories.map((cat) => (
                        <AccordionItem key={cat._id} value={cat.slug}>
                          <AccordionTrigger className="font-medium">
                            {cat.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="pl-4 space-y-2">
                              {cat.children?.map((sub) => (
                                <li key={sub._id}>
                                  <SheetClose asChild>
                                    <Link to={`/products?c=${sub._id}`}>
                                      {sub.title}
                                    </Link>
                                  </SheetClose>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <hr />

                    {user && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout?.();
                          navigate("/");
                        }}
                      >
                        Logout
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </nav>

      <div className="sticky top-0 z-40 bg-[#0D3B66] text-white shadow">
        <div className="container mx-auto px-4">
          <ul className="flex h-12 items-center gap-8 font-semibold text-sm">

            {categories.map((cat) => (
              <li key={cat._id} className="relative group cursor-pointer">

                <Link
                  to={`/products?c=${cat._id}`}
                  className="hover:text-yellow-300 transition flex items-center gap-1"
                >
                  {cat.title.toUpperCase()}
                  {cat.children?.length > 0 && <ChevronDown className="h-4 w-4" />}
                </Link>

                {/* Hover Dropdown */}
                {cat.children?.length > 0 && (
                  <div
                    className="
                      absolute left-0 top-full mt-2 
                      bg-white text-black shadow-lg rounded-md p-4 
                      w-64 z-50 opacity-0 invisible 
                      group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200
                    "
                  >
                    <ul className="space-y-2">
                      {cat.children.map((sub) => (
                        <li key={sub._id}>
                          <Link
                            to={`/products?c=${sub._id}`}
                            className="block hover:text-blue-600"
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </li>
            ))}

          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
