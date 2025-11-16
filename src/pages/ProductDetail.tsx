import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  ShoppingCart,
  Heart,
  Star as StarIcon,
  Minus,
  Plus,
  ArrowLeft,
  Shield,
  Truck,
} from "lucide-react";
import { useIntersection } from "@mantine/hooks";

import { Button } from "@/components/ui/button";

import { productService } from "@/services/product.service";
import { reviewService } from "@/services/review.service";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";
import { Badge } from "@/components/ui/badge";

// Helpers
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "";

const Star = ({ className = "" }: { className?: string }) => (
  <StarIcon className={className} />
);

const SkeletonCard = () => (
  <div className="animate-pulse bg-card border border-border rounded-lg p-4">
    <div className="bg-surface h-48 w-full mb-4 rounded" />
    <div className="h-4 bg-surface rounded w-3/4 mb-2" />
    <div className="h-3 bg-surface rounded w-1/2" />
    <div className="mt-3 h-8 bg-surface rounded w-1/3" />
  </div>
);

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState("");

  const queryClient = useQueryClient();

  // Fetch product
  const { data: productRes, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await productService.getBySlug(slug);
      return res.data;
    },
  });

  const product = productRes ?? null;
  const productId = product?._id;

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isReviewsLoading,
  } = useInfiniteQuery({
    queryKey: ["reviews", productId],
    queryFn: async ({ pageParam }) => {
      const response = await reviewService.getProductReviews(productId, {
        limit: 12,
        page: pageParam,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page >= lastPage.totalPages ? null : lastPage.page + 1;
    },
  })

  const reviews =
    reviewsData?.pages?.flatMap((page: any) => page.reviews) || [];

  const loadMoreRef = useRef(null);
  const { ref: intersectionRef, entry } = useIntersection({
    root: loadMoreRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ratingSummary = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total
        : product?.rating || 0;

    const counts = [5, 4, 3, 2, 1].map(
      (star) => reviews.filter((r: any) => r.rating === star).length
    );

    return { total, avg, counts };
  }, [reviews, product]);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await cartService.addToCart(productId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await wishlistService.addProduct(productId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const res = await reviewService.create({ productId, ...payload });
      return res.data;
    },
    onSuccess: () => {
      setReviewModalOpen(false);
      setCommentInput("");
      setRatingInput(5);

      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
    },
  });

  if (isProductLoading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Loading product...</h1>
        <SkeletonCard />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return alert("Comment required");

    createReviewMutation.mutate({
      rating: ratingInput,
      comment: commentInput,
    });
  };

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <Link to="/products">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      {/* PRODUCT TOP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: IMAGE */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl bg-muted overflow-hidden">
            <img src={product.thumbnail} className="object-contain w-full h-full" />
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            by <span className="font-medium">{product.brand?.name}</span> • SKU:{" "}
            {product.sku}
          </p>

          {/* Product Rating */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} • {product.reviewCount} reviews
            </span>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="text-sm">Qty</span>
            <div className="flex items-center border border-border rounded-full">
              <Button
                variant="ghost"
                size="icon"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-4">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-full"
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => addToWishlistMutation.mutate()}
              disabled={addToWishlistMutation.isPending}
              className="rounded-full"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="pt-2 border-t border-border">
                <h3 className="text-base font-medium mb-2">Specifications</h3>
                <dl className="space-y-1 text-sm text-muted-foreground">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-border/40 pb-1"
                    >
                      <dt className="font-medium text-foreground">{key}</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="pt-2">
              <h3 className="text-base font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full text-xs px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Info Icons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">2–3 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Quality Assured</p>
                <p className="text-xs text-muted-foreground">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------
          REVIEWS SECTION
      ------------------------------ */}
      <section className="mt-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium">Customer Reviews</h2>
            <p className="text-sm text-muted-foreground">
              Verified buyer experiences
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setReviewModalOpen(true)}>
            Write a Review
          </Button>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center border border-border p-4 rounded-lg bg-card">
            <div className="text-3xl font-bold">{ratingSummary.avg.toFixed(1)}</div>
            <div className="flex mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(ratingSummary.avg)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <p className="text-sm mt-1 text-muted-foreground">
              Based on {ratingSummary.total} reviews
            </p>
          </div>

          {/* Bar Graph */}
          <div className="md:col-span-2 border border-border rounded-lg p-4 bg-card">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = ratingSummary.counts[i];
              const percent =
                ratingSummary.total > 0 ? (count / ratingSummary.total) * 100 : 0;

              return (
                <div className="flex items-center gap-3 mb-2" key={star}>
                  <span className="w-10 text-sm">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-xs text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review List */}
        <div className="grid gap-4 md:grid-cols-2">
          {isReviewsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((review: any) => (
              <div key={review._id} className="border rounded-lg p-4 bg-card">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {review.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-green-600 flex items-center gap-1">
                    ✔ Verified Purchase
                  </span>
                </div>

                <p className="text-sm">{review.comment}</p>

                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Intersection Observer Trigger */}
          <div ref={intersectionRef} className="h-10 col-span-full" />

          {isFetchingNextPage && (
            <p className="text-sm col-span-full text-center text-muted-foreground py-2">
              Loading more reviews...
            </p>
          )}
        </div>
      </section>

      {/* -----------------------------
          REVIEW MODAL
      ------------------------------ */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setReviewModalOpen(false)}
          />

          <div className="relative bg-card w-full max-w-lg rounded-lg shadow-xl p-6 z-10">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Write a Review</h3>
              <button onClick={() => setReviewModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Stars */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium">Your Rating</p>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const star = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className={`p-1 rounded ${star <= ratingInput ? "bg-yellow-100" : ""
                          }`}
                      >
                        <Star
                          className={`h-6 w-6 ${star <= ratingInput
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <p className="mb-1 text-sm font-medium">Your review</p>
                <textarea
                  rows={4}
                  className="w-full border border-border rounded p-2"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending ? "Posting..." : "Submit"}
                </Button>
              </div>
            </form>

            {createReviewMutation.isError && (
              <p className="text-sm text-red-500 mt-2">
                Failed to submit review
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
