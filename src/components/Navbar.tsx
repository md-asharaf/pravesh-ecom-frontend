import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth";
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
import { productService } from "@/services/product.service";

type ProductSuggestion = any;
type CategoryNode = any;

type NavbarProps = {
  wishlistCount?: number;
  cartCount?: number;
  tree: CategoryNode[];
};

const Navbar: React.FC<NavbarProps> = ({ wishlistCount, cartCount, tree }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await productService.getAll({
          page: 1,
          limit: 6,
          search: search.trim(),
        });
        setSuggestions(res.data.products || []);
      } catch {
        setSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearchSubmit = () => {
    if (!search.trim()) return;
    navigate(`/products?s=${encodeURIComponent(search.trim())}`);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  const handleSuggestionClick = (item: ProductSuggestion) => {
    navigate(`/product/${item.slug}`);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };
  return (
    <header>
      <nav className="w-full shadow-sm border-b bg-white">
        <div className="lg:px-8 xl:px-4 2xl:px-24 mx-auto px-4">
          <div className="flex h-20 items-center justify-between gap-4">

            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://img.freepik.com/premium-vector/white-logo-construction-project-called-construction_856308-794.jpg?semt=ais_hybrid&w=740&q=80"
                className="h-12 w-auto rounded-md"
              />
              <span className="text-lg font-bold">Pravesh</span>
            </Link>

            <ul className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6 font-medium text-[15px] text-gray-700">
              <li><Link to="/categories" className="hover:text-accent">Categories</Link></li>
              <li><Link to="/brands" className="hover:text-accent">Brands</Link></li>
              <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>

            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <Input
                type="text"
                placeholder="Search for products…"
                className="h-12 pl-12 pr-12 rounded-full bg-gray-100"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

              <button
                onClick={handleSearchSubmit}
                disabled={!search.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent hover:bg-accent/80"
              >
                <Search className="h-5 w-5 text-white" />
              </button>

              {showSuggestions && search.trim().length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl border z-50 max-h-80 overflow-y-auto">
                  {suggestions.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No products found</div>
                  ) : (
                    suggestions.map((item) => (
                      <div
                        key={item._id}
                        onMouseDown={() => handleSuggestionClick(item)}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
                      >
                        <img src={item.thumbnail} className="h-10 w-10 rounded-md object-cover" />
                        <div>
                          <span className="font-medium text-sm block">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.brand?.name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button variant="outline" onClick={() => navigate("/profile")} className="rounded-xl px-2 lg:px-4">
                  <User className="h-4 w-4" /> <span className="ml-2">Account</span>
                </Button>
              ) : (
                <Button variant="outline" asChild className="rounded-xl">
                  <Link to="/login">Login</Link>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigate("/wishlist")}
                className="relative inline-flex items-center gap-2 px-2 lg:px-4 py-2 rounded-xl border"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs px-1 rounded-full">
                  {wishlistCount}
                </span>
              </Button>

              <Button
                onClick={() => navigate("/cart")}
                variant="outline"
                className="relative inline-flex items-center gap-2 px-2 lg:px-4 py-2 rounded-xl border"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              </Button>
            </div>

            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Link to="/cart" className="p-2 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>

              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md lg:hidden">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80 p-0">
                  <div className="bg-accent/30 text-accent/70 px-6 py-6 rounded-bl-3xl flex items-center justify-between">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(user ? "/profile" : "/login")}
                    >
                      <p className="text-lg font-semibold">{user ? user.name : "Welcome"}</p>
                      <p className={`text-sm text-gray-800 opacity-80 ${user ? "" : "hover:underline"}`}>
                        {user ? user.email : "Sign in"}
                      </p>
                    </div>

                    {/* <SheetClose asChild>
                      <button>
                        <X className="h-5 w-5" />
                      </button>
                    </SheetClose> */}
                  </div>

                  <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild><Link to="/categories">Categories</Link></SheetClose>
                      <SheetClose asChild><Link to="/brands">Brands</Link></SheetClose>
                      <SheetClose asChild><Link to="/blog">Blog</Link></SheetClose>
                      <SheetClose asChild><Link to="/about">About</Link></SheetClose>
                      <SheetClose asChild><Link to="/contact">Contact</Link></SheetClose>
                    </div>

                    <hr />

                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">CATEGORIES</p>
                      <Accordion type="single" collapsible className="space-y-2">
                        {tree.map((cat: CategoryNode) => (
                          <AccordionItem key={cat._id} value={cat.slug} className="rounded-xl border">
                            <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                              {cat.title}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <ul className="space-y-2">
                                {cat.children?.map((sub: CategoryNode) => (
                                  <li key={sub._id}>
                                    <SheetClose asChild>
                                      <Link to={`/products?c=${sub._id}`} className="text-sm">
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
                    </div>

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

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm py-4 px-2">
          <div className="container mx-auto px-2">

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  autoFocus
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  className="h-9 pl-10 rounded-full bg-gray-100"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

            </div>

            <div className="mt-4 rounded-xl text-center border max-h-[60vh] overflow-y-auto">
              {suggestions.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No results found</div>
              ) : (
                suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-100"
                  >
                    <img src={item.thumbnail} className="h-12 w-12 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand?.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
