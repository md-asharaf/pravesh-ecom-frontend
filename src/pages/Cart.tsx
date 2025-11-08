import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth";
import { cartService } from "@/services/cart.service";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth()
  const { data: cart } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: async () => {
      const response = await cartService.getMyCart();
      return response.data;
    },
    enabled: !!user
  });

  const cartItems = cart?.items || [];

  const { data: cartSummary } = useQuery({
    queryKey: ["cart-summary", user?._id],
    queryFn: async () => {
      const response = await cartService.getCartSummary();
      return response.data;
    },
    enabled: !!cart
  })

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
      const response = await cartService.updateCart(productId, quantity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      toast.success("Product added to cart");
    },
    onError: () => {
      toast.error("Failed to add product to cart")
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await cartService.removeFromCart(productId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      toast.success("Product removed from cart");
    },
    onError: () => {
      toast.error("Failed to remove product from cart")
    }
  });

  const shipping = cartSummary?.totalPrice <= 10000 ? 50 : 0;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add products to get started</p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems?.map((item) => {
              const product = item.product as Product;
              return <Card key={product._id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        SKU: {product.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ₹{(product.finalPrice * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₹{product.finalPrice} per {product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeFromCartMutation.mutate(product._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            }
            )}
          </div>

          {/* Order Summary */}
          {cartSummary && <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{cartSummary.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {cartSummary.totalPrice <= 10000 && (
                    <p className="text-sm text-muted-foreground">
                      Add ₹{(10000 - cartSummary.totalPrice).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{cartSummary.totalPrice.toLocaleString()}</span>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                <Button variant="outline" className="w-full mt-3" asChild>
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
