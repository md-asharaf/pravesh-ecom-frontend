import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Calendar, DollarSign } from "lucide-react";
import { Order } from "@/types";
import { Link } from "react-router-dom";

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  approved: "bg-orange-100 text-orange-700",
  confirmed: "bg-purple-100 text-purple-700",
  received: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-pink-100 text-pink-700",
};

const statusMessages: Record<string, string> = {
  delivered: "Your order has been delivered",
  shipped: "Your order was shipped",
  out_for_delivery: "Your order is out for delivery",
  approved: "Seller has approved your order",
  confirmed: "Your order is confirmed",
  received: "Waiting for seller confirmation",
  cancelled: "Your order was cancelled",
  refunded: "Your order has been refunded",
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const response = await orderService.getById(orderId);
      return response.data;
    },
    enabled: !!orderId,
  });

  const order: Order | undefined = data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <div className="h-10 w-48 bg-muted rounded animate-pulse" />
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/orders")}
        className="mb-4 sm:mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="space-y-4 sm:space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl mb-2">Order Details</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Order ID: {order._id}
                </p>
              </div>
              <Badge
                className={`${
                  statusColors[order.status] || "bg-gray-100 text-gray-700"
                } capitalize text-sm px-4 py-2`}
              >
                {order.status.replace(/_/g, " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-muted-foreground">
              {statusMessages[order.status] || "Order status updated"}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item, index) => {
                    const product =
                      typeof item.product === "object" ? item.product : null;
                    const productId =
                      typeof item.product === "string"
                        ? item.product
                        : product?._id;

                    return (
                      <div
                        key={index}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                      >
                        {product?.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name || "Product"}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          {product?.slug ? (
                            <Link
                              to={`/product/${product.slug}`}
                              className="font-semibold text-base sm:text-lg hover:underline block"
                            >
                              {product.name || "Product"}
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-base sm:text-lg">
                              {product?.name || "Product"}
                            </h3>
                          )}
                          <div className="mt-2 space-y-1 text-xs sm:text-sm text-muted-foreground">
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₹{item.price.toLocaleString()}</p>
                            <p className="font-semibold text-foreground">
                              Subtotal: ₹
                              {(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom Order Image */}
            {order.isCustomOrder && order.image && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Custom Order Image</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <img
                    src={order.image}
                    alt="Custom order"
                    className="w-full max-w-md rounded-lg border"
                  />
                </CardContent>
              </Card>
            )}

            {/* Feedback */}
            {order.feedback && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Feedback</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-muted-foreground">{order.feedback}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Order Date</p>
                    <p className="text-xs break-words">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium">Last Updated</p>
                      <p className="text-xs break-words">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                <div className="pt-3 sm:pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl sm:text-2xl font-bold">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-semibold">
                      {order.shippingAddress.fullname}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.line1}
                    </p>
                    {order.shippingAddress.line2 && (
                      <p className="text-muted-foreground">
                        {order.shippingAddress.line2}
                      </p>
                    )}
                    {order.shippingAddress.landmark && (
                      <p className="text-muted-foreground">
                        {order.shippingAddress.landmark}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.country}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="text-muted-foreground mt-2">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

