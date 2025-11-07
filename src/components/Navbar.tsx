import { Link } from "react-router-dom";
import { ShoppingCart, User, Heart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [isLoggedIn] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
        Home
      </Link>
      <Link to="/products" className="text-foreground hover:text-primary transition-colors font-medium">
        Products
      </Link>
      <Link to="/categories" className="text-foreground hover:text-primary transition-colors font-medium">
        Categories
      </Link>
      <Link to="/brands" className="text-foreground hover:text-primary transition-colors font-medium">
        Brands
      </Link>
      <Link to="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
        Blog
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-hero rounded-md" />
            <span className="text-xl font-bold text-foreground">SteelMart</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="hidden md:flex">
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                  {!isLoggedIn && (
                    <Button asChild>
                      <Link to="/auth">Login</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
