import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trash, Trash2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromWishlist } from "@/store/slices/wishlist";
import { Product } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistService } from "@/services/wishlist.service";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  const removeFromWishlistMutation = useMutation({
    mutationFn: wishlistService.removeProduct,
    onSuccess: (data, productId) => {
      toast.success(data.message);
      dispatch(removeFromWishlist(productId));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    }
  })
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        My Wishlist ({items.length})
      </h1>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center text-muted-foreground">
            <p className="text-sm sm:text-base">Your wishlist is empty.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3 sm:space-y-4">
        {items.map((it: Product) => {
          // const discountedPercent = it.originalPrice
          //   ? Math.round(
          //     ((it.originalPrice - it.originalPrice) / it.originalPrice) * 100
          //   )
          //   : null;

          return (
            <Card key={it._id} className="border rounded-none shadow-sm">
              <CardContent className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-start">

                {/* Product Image */}
                <Link to={`/product/${it.slug}`} className="flex-shrink-0">
                  <img
                    src={it.thumbnail}
                    alt={it.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain border rounded-md bg-white"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-1 min-w-0">

                  <Link
                    to={`/product/${it.slug}`}
                    className="font-semibold text-base sm:text-lg hover:text-primary leading-tight block break-words"
                  >
                    {it.name}
                  </Link>

                  {/* Availability
                  <p className={`text-sm font-medium ${
                    it.stock > 0
                      ? "text-green-600"
                      : it.comingSoon
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}>
                    {it.stock > 0
                      ? "In Stock"
                      : it.comingSoon
                      ? "Coming Soon"
                      : "Currently unavailable"}
                  </p> */}

                  {/* Price Section */}
                  {/* <div className="text-lg font-semibold mt-1">
                    ₹{it.originalPrice?.toLocaleString()}
                  </div>

                  {it.originalPrice && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-through text-muted-foreground">
                        ₹{it.originalPrice.toLocaleString()}
                      </span>
                      {discountedPercent !== null && (
                        <span className="text-green-600 font-semibold">
                          {discountedPercent}% off
                        </span>
                      )}
                    </div>
                  )} */}
                </div>

                {/* Delete Icon */}
                <button
                  className="text-gray-400 hover:text-red-600 flex-shrink-0 p-1"
                  onClick={() => removeFromWishlistMutation.mutate(it._id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
