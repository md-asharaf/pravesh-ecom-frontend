import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { User } from "@/types";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { categoryService } from "@/services/category.service";
import { useDispatch } from "react-redux";
import { setCart } from "@/store/slices/cart";
import { setWishlist } from "@/store/slices/wishlist";
import { setCategoryTree } from "@/store/slices/category";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    (async () => {
      try {
        const res = await userService.getMe();
        setUser(res?.data || null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
  if (!user) return;

  const fetchAll = async () => {
    try {
      const cartRes = await cartService.getMyCart();
      console.log("Fetched cart data:", cartRes.data);
      dispatch(setCart(cartRes.data));

      const wishRes = await wishlistService.getWishlist();
      dispatch(setWishlist(wishRes.data));

      const catRes = await categoryService.getTree();
      dispatch(setCategoryTree(catRes.data));

    } catch (err) {
      console.error("Error loading initial data:", err);
    }
  };

  fetchAll();

}, [user]);


  const login = useCallback((user: User) => {
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}