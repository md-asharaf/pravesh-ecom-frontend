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
    onSuccess: (data,id) => {
      toast.success(data.message);
      dispatch(removeFromWishlist(id));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    }
  })
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        My Wishlist ({items.length})
      </h1>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Your wishlist is empty.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((it: Product) => {
          // const discountedPercent = it.originalPrice
          //   ? Math.round(
          //     ((it.originalPrice - it.originalPrice) / it.originalPrice) * 100
          //   )
          //   : null;

          return (
            <Card key={it._id} className="border rounded-none shadow-sm">
              <CardContent className="p-4 flex gap-4 items-start">

                {/* Product Image */}
                <Link to={`/product/${it.slug}`}>
                  <img
                    src={it.thumbnail}
                    alt={it.name}
                    className="w-24 h-24 object-contain border rounded-md bg-white"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-1">

                  <Link
                    to={`/product/${it.slug}`}
                    className="font-semibold text-lg hover:text-primary leading-tight"
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
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => removeFromWishlistMutation.mutate(it._id)}
                >
                  <Trash className="h-5 w-5" />
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
