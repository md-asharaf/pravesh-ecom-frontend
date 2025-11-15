import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth";
import { cartService } from "@/services/cart.service";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { items: cartItems } = useAppSelector((state) => state.cart);
  console.log(cartItems)
  const { data: cartSummary } = useQuery({
    queryKey: ["cart-summary", user?._id],
    queryFn: async () => (await cartService.getCartSummary()).data,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => (await cartService.updateCart(productId, quantity)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      toast.success("Cart updated");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => (await cartService.removeFromCart(id)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      toast.success("Removed from cart");
    },
  });

  const shipping = cartSummary?.totalPrice <= 10000 ? 50 : 0;

  if (cartItems.length === 0)
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <Card className="text-center py-12 shadow-sm">
          <CardContent>
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to your cart</p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* LEFT: ITEMS */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => {
          const product = item.product;
          console.log(product);
          return (
            <Card key={product._id} className="rounded-none shadow-sm">
              <CardContent className="p-4 flex gap-4">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.thumbnail}
                    className="w-28 h-28 object-contain border rounded"
                  />
                </Link>

                <div className="flex-1 space-y-1">
                  <Link to={`/product/${product.slug}`}>
                    <p className="text-lg font-medium leading-tight hover:text-primary">{product.name}</p>
                  </Link>
                  <p className="text-xs text-green-700 font-semibold">In stock</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-semibold">₹{(product.originalPrice * item.quantity).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">₹{product.originalPrice.toLocaleString()} each</p>
                  </div>

                  <div className="flex gap-4 mt-3 items-center">
                    <div className="flex items-center border rounded">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                          disabled={item.quantity >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button> */}
                    </div>
                    <Button variant="link" className="text-sm">SAVE FOR LATER</Button>
                    <Button
                      variant="link"
                      className="text-sm text-red-600"
                      onClick={() => removeFromCartMutation.mutate(product._id)}
                    >
                      REMOVE
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RIGHT: PRICE SUMMARY */}
      <div className="space-y-4">
        <Card className="rounded-none shadow-sm sticky top-24">
          <CardContent className="p-4 space-y-4">
            <p className="text-lg font-semibold text-muted-foreground">PRICE DETAILS</p>
            <Separator />

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{cartSummary?.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>

            {shipping !== 0 && (
              <p className="text-xs text-muted-foreground">Add ₹{(10000 - cartSummary.totalPrice).toLocaleString()} for free shipping</p>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₹{cartSummary?.totalPrice.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Button asChild className="w-full py-4 text-lg rounded-none bg-orange-500 hover:bg-orange-600">
          <Link to="/checkout">PLACE ORDER</Link>
        </Button>
      </div>
    </div>
  );
};

export default Cart;