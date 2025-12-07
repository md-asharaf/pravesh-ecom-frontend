import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth";
import { cartService } from "@/services/cart.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, setCart, updateQuantity } from "@/store/slices/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const dispatch = useAppDispatch()
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { data, isLoading } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: async () => {
      const res = await cartService.getMyCart();
      return res.data;
    },
    enabled: cartItems.length === 0,
  })

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => await cartService.updateCart(productId, quantity),
    onSuccess: ({ message }, { productId, quantity }) => {
      dispatch(updateQuantity({ productId, quantity }));
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      toast.success(message ?? "Cart updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to update cart");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => await cartService.removeFromCart(id),
    onSuccess: ({ message }, productId) => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?._id] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary", user?._id] });
      dispatch(removeItem(productId));
      toast.success(message ?? "Removed from cart");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Failed to remove from cart");
    },
  });

  useEffect(() => {
    if (data && data.items.length > 0) {
      dispatch(setCart(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <Loader />
  }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* LEFT: ITEMS */}
      <div className="lg:col-span-2 space-y-3 sm:space-y-4">
        {cartItems.map((item) => {
          const product = item.product;
          return (
            <Card key={product._id} className="rounded-none shadow-sm">
              <CardContent className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                  <img
                    src={product.thumbnail}
                    className="w-20 h-20 sm:w-28 sm:h-28 object-contain border rounded"
                    alt={product.name}
                  />
                </Link>

                <div className="flex-1 space-y-1 min-w-0">
                  <Link to={`/product/${product.slug}`}>
                    <p className="text-base sm:text-lg font-medium leading-tight hover:text-primary break-words">{product.name}</p>
                  </Link>
                  <p className="text-xs text-green-700 font-semibold">In stock</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>

                  {/* <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-semibold">₹{(product.originalPrice * item.quantity).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">₹{product.originalPrice.toLocaleString()} each</p>
                  </div> */}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 items-start sm:items-center">
                    <div className="flex items-center border rounded">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-10 sm:w-10"
                        onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <span className="px-3 sm:px-4 font-semibold text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-10 sm:w-10"
                        onClick={() => updateCartMutation.mutate({ productId: product._id, quantity: item.quantity + 1 })}
                      // disabled={item.quantity >= product.stock}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    {/* <Button variant="link" className="text-sm">SAVE FOR LATER</Button> */}
                    <Button
                      variant="link"
                      className="text-xs sm:text-sm text-red-500 p-0 h-auto"
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
        <Button asChild className="w-full py-3 sm:py-4 text-base sm:text-lg rounded-none">
          <Link to="/checkout" className="w-full py-3 sm:py-4 text-base sm:text-lg rounded-none">CHECKOUT</Link>
        </Button>
      </div>

      {/* RIGHT: PRICE SUMMARY */}
      <div className="space-y-4">
        {/* <Card className="rounded-none shadow-sm sticky top-24">
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
        </Card> */}

      </div>
    </div>
  );
};

export default Cart;