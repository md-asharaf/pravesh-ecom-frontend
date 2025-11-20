import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const OrderCard = ({ order, statusColors }: any) => {
  return (
    <Card className="rounded-md border shadow-sm">
      {order.items.map((item: any) => {
        const product = item.product;

        return (
          <div
            key={product._id}
            className="flex gap-4 p-4 border-b last:border-0"
          >
            <img
              src={product.thumbnail}
              className="w-20 h-20 object-contain"
            />

            <div className="flex-1">
              <Link
                to={`/product/${product.slug}`}
                className="font-semibold text-lg"
              >
                {product.name}
              </Link>
            </div>

            <div className="text-right">
              <Badge
                className={`${
                  statusColors[order.status] ||
                  "bg-gray-100 text-gray-700"
                } capitalize`}
              >
                {order.status.replace(/_/g, " ")}
              </Badge>

              <p className="text-xs text-gray-500 mt-1">
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
          </div>
        );
      })}
    </Card>
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

