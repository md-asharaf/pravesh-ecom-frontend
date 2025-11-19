import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader";

const Orders = () => {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await orderService.getMyOrders();
      return res?.data;
    },
  });

  const orders = ordersData?.orders || [];

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 flex gap-6 max-w-7xl">

      <Card className="w-64 p-4 h-auto">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <div className="space-y-6">

          {/* Order Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ORDER STATUS</h3>

            {["On the way", "Delivered", "Cancelled", "Returned"].map((s) => (
              <label key={s} className="flex items-center gap-2 py-1">
                <Checkbox />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>

          {/* Order Time */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ORDER TIME</h3>

            {["Last 30 days", "2024", "2023", "Older"].map((t) => (
              <label key={t} className="flex items-center gap-2 py-1">
                <Checkbox />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>

        </div>
      </Card>

      <div className="flex-1">

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Search your orders here"
            className="h-12 rounded-md"
          />
          <Button className="h-12 px-6 text-accent hover:bg-accent/20">
            Search Orders
          </Button>
        </div>

        {/* NO ORDERS */}
        {orders.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">
            No orders found.
          </Card>
        )}

        {/* ORDER LIST */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="rounded-md border shadow-sm">

              {/* Each product inside the order */}
              {order.items.map((item: any, index: number) => {
                const product: Product = item.product;

                return (
                  <div
                    key={product._id}
                    className={`flex gap-4 p-4 ${index !== order.items.length - 1 ? "border-b" : ""}`}
                  >
                    {/* Product Image */}
                    <img
                      src={product.thumbnail}
                      className="w-24 h-24 object-contain"
                    />

                    {/* Center: Product Info */}
                    <div className="flex-1 space-y-1">
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-semibold text-lg hover:text-accent"
                      >
                        {product.name}
                      </Link>

                      {/* <p className="text-sm text-gray-500">
                          Color: {product.color || "N/A"}  
                          {product.size && <> • Size: {product.size}</>}
                          </p> */}


                      {/* <div className="text-lg font-semibold mt-1">
                        ₹{product.originalPrice.toLocaleString()}
                      </div> */}
                    </div>

                    {/* Right side: Delivery Status */}
                    <div className="text-right space-y-2">

                      {/* Delivered */}
                      {order.status === "delivered" && (
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className="bg-emerald-100 text-emerald-700">Delivered</Badge>
                          <p className="text-xs text-gray-500">
                            Your item has been delivered
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-sm rounded-full"
                          >
                            <Star className="w-4 h-4" />
                            Rate & Review Product
                          </Button>
                        </div>
                      )}

                      {order.status === "cancelled" && (
                        <>
                          <Badge className="bg-red-100 text-red-700">Cancelled</Badge>
                          <p className="text-xs text-gray-500">
                            order has been cancelled
                          </p>
                        </>
                      )}

                      {/* Processing */}
                      {order.status === "awaiting_confirmation" && (
                        <>
                          <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                          <p className="text-xs text-gray-500">
                            Waiting for confirmation from seller.
                          </p>
                        </>
                      )
                      }

                      {/* Processing */}
                      {order.status === "awaiting_payment" && (
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                          <p className="text-xs text-gray-500">
                            Waiting for your confirmation.
                          </p>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex items-center gap-1 text-sm font-medium hover:underline rounded-full"
                          >
                            <Star className="w-4 h-4" />
                            Confirm Order
                          </Button>
                        </div>
                      )}

                      {/* Shipped */}
                      {order.status === "shipped" && (
                        <>
                          <Badge className="bg-accent/20 text-accent/80">Shipped</Badge>
                          <p className="text-xs text-gray-500">
                            Estimated delivery by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        </>
                      )
                      }

                      {/* Processing */}
                      {order.status === "processing" && (
                        <>
                          <Badge className="bg-indigo-100 text-indigo-700">Processing</Badge>
                          <p className="text-xs text-gray-500">
                            Items will be shipped shortly.
                          </p>
                        </>
                      )
                      }
                    </div>
                  </div>
                );
              })}

              {/* REFUND INFORMATION BOX (like Flipkart) */}
              {/* {order.status === "refunded" && (
                <div className="bg-gray-50 p-4 text-sm text-gray-700 border-t">
                  <p className="text-green-600 font-semibold mb-1">
                    Refund Completed (Refund ID: {order.refundId})
                  </p>
                  <p>
                    Refund was added to your bank account on{" "}
                    <strong>{order.refundDate}</strong>. If you don't see it,
                    contact your bank and share refund reference number{" "}
                    <strong>{order.refundReference}</strong>.
                  </p>
                </div>
              )} */}

            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
