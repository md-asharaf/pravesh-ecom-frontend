import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const OrderCard = ({ order, statusColors }: any) => {
  const navigate = useNavigate();
  const [showAllItems, setShowAllItems] = useState(false);
  const MAX_VISIBLE_ITEMS = 2;
  const items = order.items || [];
  const visibleItems = showAllItems ? items : items.slice(0, MAX_VISIBLE_ITEMS);
  const remainingItemsCount = items.length - MAX_VISIBLE_ITEMS;
  const hasManyItems = items.length > 5;

  return (
    <div onClick={() => navigate(`/orders/${order._id}`)}>
      <Card className="rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="text-sm font-medium break-all">{order._id}</p>
            </div>
            <Badge
              className={`${statusColors[order.status] ||
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

        <div className="divide-y">
          <div
            className={showAllItems && hasManyItems ? "max-h-[400px] overflow-y-auto" : ""}
          >
            {visibleItems.map((item: any, index: number) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={product._id || index}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={product.thumbnail || "/placeholder-product.png"}
                    alt={product.name || "Product"}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {product.slug ? (
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-semibold text-sm sm:text-base md:text-lg hover:underline block break-words"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.name || "Product"}
                      </Link>
                    ) : (
                      <p className="font-semibold text-sm sm:text-base md:text-lg break-words">
                        {product.name || "Product"}
                      </p>
                    )}
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length > MAX_VISIBLE_ITEMS && (
            <div
              className="p-3 sm:p-4 border-t bg-muted/30"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllItems(!showAllItems);
              }}
            >
              <button
                className="flex items-center justify-center gap-2 w-full text-sm sm:text-base text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllItems(!showAllItems);
                }}
              >
                {showAllItems ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>View {remainingItemsCount} more item{remainingItemsCount !== 1 ? 's' : ''}</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
              {hasManyItems && !showAllItems && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Click to view all {items.length} items or view order details for full information
                </p>
              )}
            </div>
          )}

          {items.length > 1 && (
            <div className="p-3 sm:p-4 border-t bg-muted/20">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                <span>
                  {items.length} item{items.length !== 1 ? 's' : ''} in this order
                </span>
                {hasManyItems && (
                  <span className="text-primary font-medium">
                    View details →
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
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

