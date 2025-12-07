import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: "cart" | "wishlist";
}

export const LoginModal = ({ open, onOpenChange, action = "cart" }: LoginModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/login");
  };

  const actionText = action === "cart" ? "add items to cart" : "add items to wishlist";
  const Icon = action === "cart" ? ShoppingCart : Heart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Login Required</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Please login to {actionText}. You'll be redirected to the login page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col">
          <Button
            onClick={handleLogin}
            className="w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

