import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { productService } from "@/services/product.service";

type FiltersState = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: string;
  rating?: number;
};

const LOCAL_STORAGE_KEY = "productFilters_v1";
const DEBOUNCE_MS = 500;
const PAGE_LIMIT = 12;

const Products: React.FC = () => {
  const lastItemRef = useRef<HTMLElement | null>(null);

  // URL params
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState<string>(
    () => searchParams.get("s") ?? ""
  );

  const urlFilters = useMemo<FiltersState>(() => {
    const s = searchParams;
    return {
      search: s.get("s") ?? undefined,
      categoryId: s.get("c") ?? undefined,
      brandId: s.get("b") ?? undefined,
      minPrice:
        s.get("mnp") !== null ? Number(s.get("mnp")) : undefined,
      maxPrice:
        s.get("mxp") !== null ? Number(s.get("mxp")) : undefined,
      sort: s.get("sort") ?? undefined,
      order: s.get("order") ?? undefined,
      isFeatured: s.get("sort") === "featured" ? true : undefined,
      isNewArrival: s.get("sort") === "newest" ? true : undefined,
      rating: s.get("rating") ? Number(s.get("rating")) : undefined,
    };
  }, [searchParams]);

  const {
    data: filtersData,
    isLoading: isFiltersLoading,
  } = useQuery({
    queryKey: ["product-filters"],
    queryFn: async () => {
      const res = await productService.getFilters();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const categories = filtersData?.categories ?? [];
  const brands = filtersData?.brands ?? [];
  const minPriceLimit = filtersData?.priceRange?.minPrice ?? 0;
  const maxPriceLimit = filtersData?.priceRange?.maxPrice ?? 50000;

  useEffect(() => {
    const hasAnyParam = Array.from(searchParams.keys()).length > 0;
    if (!hasAnyParam) {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as FiltersState;
          if (parsed && Object.keys(parsed).length > 0) {
            const params: Record<string, string> = {};
            Object.entries(parsed).forEach(([k, v]) => {
              if (v === undefined || v === null || v === "") return;
              params[k] = String(v);
            });
            setSearchParams(params, { replace: true });
            setSearchInput(parsed.search ?? "");
          }
        }
      } catch (err) {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    const persist: FiltersState = {};
    for (const key of [
      "s",
      "c",
      "b",
      "mnp",
      "mxp",
      "sort",
      "order",
      "rating",
    ]) {
      const v = searchParams.get(key);
      if (v == null) continue;
      if (["mnp", "mxp", "rating"].includes(key)) {
        (persist as any)[key] = Number(v);
      } else {
        (persist as any)[key] = v;
      }
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persist));
    } catch (err) {
    }
  }, [searchParams]);
  useEffect(() => {
    const t = setTimeout(() => {
      updateParam("s", searchInput === "" ? undefined : searchInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const updateParam = (key: string, value: string | number | boolean | undefined) => {
    const next: Record<string, string> = {};
    for (const [k, v] of searchParams.entries()) {
      next[k] = v;
    }

    if (value === undefined || value === null || value === "") {
      delete next[key];
    } else {
      next[key] = String(value);
    }

    setSearchParams(next);
  };
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", urlFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const payload: any = {
        page: pageParam,
        limit: PAGE_LIMIT,
      };

      if (urlFilters.search) payload.search = urlFilters.search;
      if (urlFilters.categoryId) payload.categoryId = urlFilters.categoryId;
      if (urlFilters.brandId) payload.brandId = urlFilters.brandId;
      if (typeof urlFilters.minPrice === "number")
        payload.minPrice = urlFilters.minPrice;
      if (typeof urlFilters.maxPrice === "number")
        payload.maxPrice = urlFilters.maxPrice;
      if (urlFilters.sort) payload.sort = urlFilters.sort;
      if (urlFilters.order) payload.order = urlFilters.order;
      if (typeof urlFilters.rating === "number") payload.rating = urlFilters.rating;

      const res = await productService.getAll(payload);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page >= lastPage.totalPages ? null : lastPage.page + 1;
    },
  });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const totalProducts = data?.pages?.[0]?.total ?? 0;

  const { ref, entry } = useIntersection({
    root: lastItemRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetching]);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-card border border-border rounded-lg p-4">
      <div className="bg-surface h-48 w-full mb-4 rounded" />
      <div className="h-4 bg-surface rounded w-3/4 mb-2" />
      <div className="h-3 bg-surface rounded w-1/2" />
      <div className="mt-3 h-8 bg-surface rounded w-1/3" />
    </div>
  );

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput("");
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch { }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <p className="text-muted-foreground">Browse our complete collection</p>
      </div>

      {/* Breadcrumbs */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:underline">
              Products
            </Link>
          </li>
          {/* {breadcrumbs.map((b: any) => (
            <React.Fragment key={b._id}>
              <li>/</li>
              <li>
                <button
                  onClick={() => updateParam("c", b._id)}
                  className="hover:underline"
                >
                  {b.title}
                </button>
              </li>
            </React.Fragment>
          ))} */}
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3">Search</h3>
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {isFiltersLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-surface rounded w-3/4 my-2" />
                  ))
                ) : (
                  categories.map((cat: any) => (
                    <div key={cat._id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={urlFilters.categoryId === cat._id}
                        onCheckedChange={() =>
                          updateParam(
                            "c",
                            urlFilters.categoryId === cat._id ? undefined : cat._id
                          )
                        }
                      />
                      <Label className="text-sm cursor-pointer">{cat.title}</Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {isFiltersLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-surface rounded w-1/2 my-2" />
                  ))
                ) : (
                  brands.map((brand: any) => (
                    <div key={brand._id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={urlFilters.brandId === brand._id}
                        onCheckedChange={() =>
                          updateParam(
                            "b",
                            urlFilters.brandId === brand._id ? undefined : brand._id
                          )
                        }
                      />
                      <Label className="text-sm cursor-pointer">{brand.name}</Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-semibold mb-3">Price</h3>
              <Slider
                min={minPriceLimit}
                max={maxPriceLimit}
                step={100}
                value={[
                  urlFilters.minPrice ?? minPriceLimit,
                  urlFilters.maxPrice ?? maxPriceLimit,
                ]}
                onValueChange={(value) => {
                  updateParam("mnp", value[0]);
                  updateParam("mxp", value[1]);
                }}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{urlFilters.minPrice ?? minPriceLimit}</span>
                <span>₹{urlFilters.maxPrice ?? maxPriceLimit}</span>
              </div>
            </div>

            {/* Other filters */}
            <div>
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={urlFilters.sort === "featured"}
                    onCheckedChange={(c) => updateParam("sort", c ? "featured" : undefined)}
                  />
                  <Label className="text-sm cursor-pointer">Featured</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={urlFilters.sort === "newArrivals"}
                    onCheckedChange={(c) =>
                      updateParam("sort", c ? "newArrivals" : undefined)
                    }
                  />
                  <Label className="text-sm cursor-pointer">New Arrival</Label>
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={!!urlFilters.isDiscount}
                    onCheckedChange={(c) => updateParam("isDiscount", c ? true : undefined)}
                  />
                  <Label className="text-sm cursor-pointer">Best Sellers</Label>
                </div> */}
              </div>
            </div>

            <Button className="w-full" variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">Showing {totalProducts} products</p>

            <Select
              defaultValue={urlFilters.sort ?? "featured"}
              onValueChange={(value) => {
                if (value === "price_low") {
                  updateParam("sort", "price");
                  updateParam("order", "asc");
                } else if (value === "price_high") {
                  updateParam("sort", "price");
                  updateParam("order", "desc");
                } else {
                  updateParam("sort", value);
                }
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="bestSelling">Best Selling</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            // initial skeleton grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}

              {/* intersection sentinel */}
              <div ref={ref} className="h-1" />

              {/* loading more skeleton / indicator */}
              {(isFetchingNextPage || isFetching) && (
                <div className="col-span-full text-center py-4">
                  <div className="inline-flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Loading more...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
