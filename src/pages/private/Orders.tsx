import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Filter } from "lucide-react";
import React, { useEffect } from "react";
import { OrderCard, OrderCardSkeleton } from "@/components/OrderCard";

const Orders = () => {
  const [search, setSearch] = React.useState("");
  const [statusFilters, setStatusFilters] = React.useState<string[]>([]);
  const [timeFilters, setTimeFilters] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", debouncedSearch, statusFilters, timeFilters, page],
    queryFn: async () => {
      return orderService
        .getMyOrders({
          search: debouncedSearch,
          status: statusFilters.join(","),
          time: timeFilters.join(","),
          page,
          limit: 5,
        })
        .then((res) => res.data);
    },
    enabled: true
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  const toggleFilter = (filter: string, setter: any, list: string[]) => {
    if (list.includes(filter)) setter(list.filter((i) => i !== filter));
    else setter([...list, filter]);
    setPage(1);
  };

  const statusOptions = [
    "received",
    "approved",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const currentYear = new Date().getFullYear();

  const timeOptions = [
    "Last 30 days",
    currentYear.toString(),
    (currentYear - 1).toString(),
    "Older",
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
      <div className="sm:hidden mb-4">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full flex items-center gap-2 rounded-lg h-11">
              <Filter size={16} /> Filters
            </Button>
          </DrawerTrigger>

          <DrawerContent className="min-h-[75vh] max-h-[75vh]">
            <DrawerHeader className="px-4 pt-4">
              <DrawerTitle className="text-lg">Filters</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 pb-6 space-y-6 overflow-y-auto">
              {/* Order Time */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Order Time</h3>
                {timeOptions.map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1">
                    <Checkbox
                      checked={timeFilters.includes(t)}
                      onCheckedChange={() =>
                        toggleFilter(t, setTimeFilters, timeFilters)
                      }
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>

              {/* Order Status */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Order Status</h3>
                {statusOptions.map((s) => (
                  <label key={s} className="flex items-center gap-2 py-1">
                    <Checkbox
                      checked={statusFilters.includes(s)}
                      onCheckedChange={() =>
                        toggleFilter(s, setStatusFilters, statusFilters)
                      }
                    />
                    <span>{s.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>

              <Button className="w-full" onClick={() => refetch()}>
                Apply Filters
              </Button>
            </div>
          </DrawerContent>


        </Drawer>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <Card className="hidden sm:block sm:w-64 p-4 h-fit sticky top-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Filters</h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold mb-2">Order Status</h3>
              {statusOptions.map((s) => (
                <label key={s} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={statusFilters.includes(s)}
                    onCheckedChange={() =>
                      toggleFilter(s, setStatusFilters, statusFilters)
                    }
                  />
                  <span className="text-xs sm:text-sm">{s.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold mb-2">Order Time</h3>
              {timeOptions.map((t) => (
                <label key={t} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={timeFilters.includes(t)}
                    onCheckedChange={() =>
                      toggleFilter(t, setTimeFilters, timeFilters)
                    }
                  />
                  <span className="text-xs sm:text-sm">{t}</span>
                </label>
              ))}
            </div>

            <Button className="w-full text-sm" onClick={() => refetch()}>
              Apply Filters
            </Button>
          </div>
        </Card>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            <Input
              placeholder="Search your orders here"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 sm:h-12 rounded-md flex-1"
            />
            <Button className="h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base" onClick={() => refetch()}>
              Search
            </Button>
          </div>

          {!isLoading && orders.length === 0 && (
            <Card className="p-4 sm:p-6 text-center text-muted-foreground">
              <p className="text-sm sm:text-base">No orders found.</p>
            </Card>
          )}

          <div className="space-y-3 sm:space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
              : orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  statusColors={statusColors}
                />
              ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 sm:mt-6">
              <Pagination>
                <PaginationContent className="flex flex-wrap gap-2 sm:gap-3">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                      className="text-xs sm:text-sm"
                    />
                  </PaginationItem>

                  <PaginationItem className="px-3 sm:px-4 py-2 border rounded-md text-xs sm:text-sm">
                    Page {page} of {totalPages}
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      aria-disabled={page === totalPages}
                      className="text-xs sm:text-sm"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

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

