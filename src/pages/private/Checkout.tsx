import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { addressService } from "@/services/address.service";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/providers/auth";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Select a shipping address"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddressId: "",
    },
  });

  const {
    data: addressesData,
    isLoading: addressesLoading,
    isError: addressesError,
  } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: async () => {
      const response = await addressService.getMyAddresses({ page: 1, limit: 10 });
      return response.data.addresses;
    },
    enabled: !!user,
  });

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart", user?._id],
    queryFn: async () => {
      const response = await cartService.getMyCart();
      return response.data;
    },
    enabled: !!user,
  });

  const { data: cartSummary } = useQuery({
    queryKey: ["cart-summary", user?._id],
    queryFn: async () => {
      const response = await cartService.getCartSummary();
      return response.data;
    },
    enabled: !!user,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      return await orderService.create({
        shippingAddressId: values.shippingAddressId,
      });
    },
    onSuccess: ({data,message}) => {
      toast.success(message ?? "Order placed successfully");
      navigate("/orders");
    },
    onError: (error:any) => {
      toast.error(error.response?.data?.message ?? "Failed to place order");
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    createOrderMutation.mutate(values);
  };

  useEffect(() => {
    if (addressesData && addressesData.length > 0 && !form.getValues("shippingAddressId")) {
      form.setValue("shippingAddressId", addressesData[0]._id);
    }
  }, [addressesData, form]);

  const items = cart?.items || [];
  const subtotal = cartSummary?.totalItems ?? 0;
  const shipping = cartSummary?.totalPrice <= 500 ? 50 : 0;
  const total = cartSummary?.totalPrice ?? subtotal + shipping;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Checkout</h1>
        <Button variant="ghost" asChild className="text-sm sm:text-base">
          <Link to="/cart">Back to Cart</Link>
        </Button>
      </div>

      {!user && (
        <Card className="mb-8 border border-destructive/40">
          <CardContent className="py-6">
            <p className="text-destructive text-sm">
              You must be logged in to complete checkout.{" "}
              <Link to="/auth" className="underline">
                Login now
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Addresses + Payment */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Shipping Address Selection */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                {addressesLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading addresses...
                  </div>
                )}
                {addressesError && (
                  <p className="text-sm text-destructive">Failed to load addresses. Please try again.</p>
                )}
                {!addressesLoading && addressesData?.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No saved addresses found. Please add one in{" "}
                    <Link to="/addresses" className="underline">
                      Address Manager
                    </Link>{" "}
                    before placing an order.
                  </div>
                )}

                {/* Manage / select other addresses */}
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/addresses">Manage Addresses</Link>
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="shippingAddressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3">
                          {addressesData?.map((addr) => {
                            const selected = field.value === addr._id;
                            return (
                              <button
                                type="button"
                                key={addr._id}
                                onClick={() => field.onChange(addr._id)}
                                className={cn(
                                  "w-full text-left p-4 rounded-md border transition-colors",
                                  selected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/60",
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <MapPin
                                    className={cn(
                                      "h-5 w-5",
                                      selected ? "text-primary" : "text-muted-foreground",
                                    )}
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold">
                                      {addr.fullname} • {addr.phone}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {addr.line1}
                                      {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state}{" "}
                                      {addr.postalCode}, {addr.country}
                                    </p>
                                  </div>
                                  <div
                                    className={cn(
                                      "h-4 w-4 rounded-full border flex items-center justify-center mt-1",
                                      selected ? "border-primary bg-primary" : "border-muted-foreground",
                                    )}
                                  >
                                    {selected && <div className="h-2 w-2 rounded-full bg-background" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Payment method removed - only default COD supported; no selection UI */}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-6 sm:top-24">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {cartLoading && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading cart...
                    </div>
                  )}
                  {!cartLoading && items.length === 0 && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your cart is empty. <Link to="/products" className="underline">Shop now</Link>
                    </p>
                  )}
                  {items.map(({ product, quantity }: { product: Product, quantity: number }) => (
                    <div key={product?._id} className="flex gap-2 sm:gap-3">
                      <img
                        src={
                          product.thumbnail ||
                          "/placeholder.svg"
                        }
                        alt={product?.name || "Product"}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg bg-muted flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm line-clamp-2 break-words">
                          {product?.name || "Unnamed Product"}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                        {/* <p className="font-semibold text-sm">
                          ₹{Number(product?.originalPrice || 0).toLocaleString()}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">₹{shipping.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base sm:text-lg">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={
                    createOrderMutation.isPending ||
                    !form.getValues("shippingAddressId") ||
                    !user ||
                    items.length === 0
                  }
                >
                  {createOrderMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Placing Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                {!form.getValues("shippingAddressId") && (
                  <p className="text-xs text-destructive text-center">
                    Select a shipping address to continue.
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Checkout;