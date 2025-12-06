import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const OrderCard = ({ order, statusColors }: any) => {
  return (
    <Link to={`/orders/${order._id}`}>
      <Card className="rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="text-sm font-medium">{order._id}</p>
            </div>
            <Badge
              className={`${
                statusColors[order.status] ||
                "bg-gray-100 text-gray-700"
              } capitalize`}
            >
              {order.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {order.status === "delivered" && "Your item has been delivered"}
            {order.status === "shipped" && "Your item was shipped"}
            {order.status === "out_for_delivery" &&
              "Your item is out for delivery"}
            {order.status === "approved" &&
              "Seller has approved your order"}
            {order.status === "confirmed" &&
              "Your order is confirmed"}
            {order.status === "received" &&
              "Waiting for seller confirmation"}
            {order.status === "cancelled" &&
              "Your order was cancelled"}
          </p>
        </div>
        {order.items.map((item: any) => {
          const product = item.product;

          return (
            <div
              key={product._id}
              className="flex gap-4 p-4 border-b last:border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.thumbnail}
                className="w-20 h-20 object-contain"
              />

              <div className="flex-1">
                <Link
                  to={`/product/${product.slug}`}
                  className="font-semibold text-lg hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.name}
                </Link>
                <div className="mt-1 text-sm text-muted-foreground">
                  Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-lg font-semibold">
              ₹{order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const OrderCardSkeleton = () => (
  <Card className="rounded-md border shadow-sm p-4 animate-pulse space-y-4">
    <div className="flex gap-4 border-b pb-4">
      <div className="w-20 h-20 bg-muted rounded-md" />

      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/3 bg-muted rounded" />
      </div>

      <div className="text-right space-y-2">
        <div className="h-5 w-20 bg-muted rounded-full" />
        <div className="h-3 w-24 bg-muted rounded" />
      </div>
    </div>
  </Card>
);

