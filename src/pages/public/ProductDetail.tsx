import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import { useIntersection } from "@mantine/hooks";

import { Button } from "@/components/ui/button";

import { productService } from "@/services/product.service";
import { reviewService } from "@/services/review.service";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlist";
import { addItem } from "@/store/slices/cart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/providers/auth";
import { LoginModal } from "@/components/modals/LoginModal";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


const ProductDetail: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isWishlisted = wishlistItems.some(item => item.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalAction, setLoginModalAction] = useState<"cart" | "wishlist">("cart");

  const queryClient = useQueryClient();

  const { data: productRes, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await productService.getBySlug(slug, true);
      return res.data;
    },
  });

  const product = productRes ?? null;
  const productId = product?._id;

  const {
    data: relatedProductsData,
    fetchNextPage: fetchMoreRelatedProducts,
    hasNextPage: hasMoreRelatedProducts,
    isFetchingNextPage: isFetchingMoreRelatedProducts,
    isLoading: isRelatedProductsLoading,
  } = useInfiniteQuery({
    queryKey: ["related-products", productId],
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;
      const res = await productService.getRelated(productId!, {
        limit: 8,
        page: page,
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page) || 1;
      const totalPages = Number(lastPage.totalPages) || 1;
      if (currentPage >= totalPages) return undefined;
      return currentPage + 1;
    },
    enabled: !!productId,
  });

  const relatedProducts = relatedProductsData?.pages?.flatMap((page) => page.products) || [];

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isReviewsLoading,
  } = useInfiniteQuery({
    queryKey: ["reviews", productId],
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;
      const response = await reviewService.getProductReviews(productId, {
        limit: 12,
        page: page,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const currentPage = Number(lastPage.page) || 1;
      const totalPages = Number(lastPage.totalPages) || 1;
      if (currentPage >= totalPages) return undefined;
      return currentPage + 1;
    },
    enabled: !!productId,
  })

  const reviews =
    reviewsData?.pages?.flatMap((page: any) => page.reviews) || [];

  const { ref: intersectionRef, entry } = useIntersection({
    threshold: 0.1,
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
  }, [reviews, product])

  const createReviewMutation = useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const res = await reviewService.create({ productId, ...payload });
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Review submitted successfully");
      setReviewModalOpen(false);
      setCommentInput("");
      setRatingInput(5);

      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });


  const addToWishlistMutation = useMutation({
    mutationFn: wishlistService.addProduct,
    onSuccess: (data, productId) => {
      toast.success(data.message);
      dispatch(addToWishlist(product));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  })

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

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch(addItem({ product, quantity }));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      setQuantity(1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  })

  const handleWishlistClick = () => {
    if (!user) {
      setLoginModalAction("wishlist");
      setLoginModalOpen(true);
      return;
    }
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product._id!);
    } else {
      addToWishlistMutation.mutate(product._id!);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setLoginModalAction("cart");
      setLoginModalOpen(true);
      return;
    }
    addToCartMutation.mutate({ productId: product._id, quantity });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return alert("Comment required");

    createReviewMutation.mutate({
      rating: ratingInput,
      comment: commentInput,
    });
  };
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


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* PRODUCT TOP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
        {/* LEFT: IMAGE */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-full max-w-lg aspect-square rounded-xl sm:rounded-2xl bg-muted/50 overflow-hidden border border-border/50 shadow-sm">
            <img 
              src={product.thumbnail || "/placeholder.svg"} 
              alt={product.name}
              className="object-contain w-full h-full p-4" 
            />
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {product.category.path && product.category.path.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-xs sm:text-sm">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {product.category.path.map((cat, i) => (
                  <React.Fragment key={i}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/products?c=${product.category._id}`} className="text-xs sm:text-sm">
                        {cat}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2">
              {product.brand?.name && (
                <Badge variant="secondary" className="font-medium text-xs sm:text-sm">
                  {product.brand.name}
                </Badge>
              )}
              {product.sku && (
                <Badge variant="outline" className="font-mono text-xs sm:text-sm">
                  SKU: {product.sku}
                </Badge>
              )}
            </div>

            {/* Product Rating */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base font-medium">
                {product.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({product.reviewCount || 0} {product.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Qty and Buttons Section */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="text-sm sm:text-base font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 sm:px-6 text-sm sm:text-base font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-lg"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                disabled={addToWishlistMutation.isPending}
                variant="outline"
                size="icon"
                onClick={() => handleWishlistClick()}
                className={`h-11 sm:h-12 w-11 sm:w-12 rounded-lg ${isWishlisted ? "text-pink-600 border-pink-600 bg-pink-50 dark:bg-pink-950/20" : ""}`}
              >
                <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>

          {/* Info Icons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground mt-0.5">2–3 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Quality Assured</p>
                <p className="text-xs text-muted-foreground mt-0.5">100% Genuine</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-base sm:text-lg font-semibold mb-3">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start py-2 border-b border-border/40 last:border-0"
                    >
                      <dt className="font-medium text-sm sm:text-base text-foreground pr-4">{key}</dt>
                      <dd className="text-sm sm:text-base text-muted-foreground text-right flex-shrink-0">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-base sm:text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-md text-xs sm:text-sm px-3 py-1 font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {(isRelatedProductsLoading || relatedProducts.length > 0) && (
        <section className="mb-12 lg:mb-16">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">
              Related Products
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Similar products you might like
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative"
          >
            <CarouselContent className="flex gap-3 sm:gap-4 md:gap-6">
              {isRelatedProductsLoading
                ? [1, 2, 3, 4].map((i) => (
                    <CarouselItem
                      key={i}
                      className="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-xs"
                    >
                      <ProductCardSkeleton />
                    </CarouselItem>
                  ))
                : relatedProducts.length > 0
                ? relatedProducts.map((p: any) => (
                    <CarouselItem
                      key={p._id}
                      className="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-xs"
                    >
                      <ProductCard product={p} />
                    </CarouselItem>
                  ))
                : (
                    <div className="text-sm text-muted-foreground py-8 text-center">
                      No related products found
                    </div>
                  )}
            </CarouselContent>

            {/* Navigation buttons */}
            {!isRelatedProductsLoading && relatedProducts.length > 4 && (
              <>
                <CarouselPrevious className="hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
                <CarouselNext className="hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-10 lg:w-10 rounded-full" />
              </>
            )}
          </Carousel>

          {/* Load More Button */}
          {hasMoreRelatedProducts && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => fetchMoreRelatedProducts()}
                disabled={isFetchingMoreRelatedProducts}
              >
                {isFetchingMoreRelatedProducts ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Products"
                )}
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Reviews Section */}
      <section className="mb-12 lg:mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Verified buyer experiences
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setReviewModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Write a Review
          </Button>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="flex flex-col items-center border border-border p-6 rounded-xl bg-card shadow-sm">
            <div className="text-4xl sm:text-5xl font-bold mb-2">{ratingSummary.avg.toFixed(1)}</div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${i < Math.round(ratingSummary.avg)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Based on {ratingSummary.total} {ratingSummary.total === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Bar Graph */}
          <div className="md:col-span-2 border border-border rounded-xl p-4 sm:p-6 bg-card shadow-sm">
            <h3 className="text-sm sm:text-base font-semibold mb-4 text-muted-foreground">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = ratingSummary.counts[i];
              const percent =
                ratingSummary.total > 0 ? (count / ratingSummary.total) * 100 : 0;

              return (
                <div className="flex items-center gap-3 mb-3 last:mb-0" key={star}>
                  <span className="w-8 sm:w-10 text-sm sm:text-base font-medium">{star}★</span>
                  <div className="flex-1 h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-8 sm:w-10 text-xs sm:text-sm text-right font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {isReviewsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((review: any) => (
              <div
                key={review._id}
                className="border border-border rounded-xl p-5 sm:p-6 bg-card shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden text-sm sm:text-base font-medium flex-shrink-0">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (review.user?.name || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name */}
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {review.user?.name || "Anonymous"}
                      </p>

                      {/* Rating + Date */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>

                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {review.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verified */}
                  <span className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium gap-1 flex-shrink-0">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M16 8A8 8 0 11.002 8 8 8 0 0116 8zm-4.146-2.854l-4.95 4.95-2.122-2.122-.708.708L6.904 11.5l5.657-5.657-.707-.707z" />
                    </svg>
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base leading-relaxed text-foreground">
                  {review.comment}
                </p>

                {/* Images (optional) */}
                {review.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                    {review.images.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Review"
                        className="h-20 sm:h-24 w-full object-cover rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>

            ))
          )}

          <div ref={intersectionRef} className="h-10 col-span-full" />

          {isFetchingNextPage && (
            <p className="text-sm col-span-full text-center text-muted-foreground py-2">
              Loading more reviews...
            </p>
          )}
        </div>
      </section>

      {
        isReviewModalOpen && (
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
            </div>
          </div>
        )
      }
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        action={loginModalAction}
      />
    </div >
  );
};

export default ProductDetail;


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