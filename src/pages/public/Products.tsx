"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useIntersection } from "@mantine/hooks"

import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { productService } from "@/services/product.service"
type FiltersState = {
  search?: string
  categoryId?: string
  brandId?: string
  // minPrice?: number
  // maxPrice?: number
  sort?: string
  order?: string
  rating?: number
}

const LOCAL_STORAGE_KEY = "productFilters_v1"
const DEBOUNCE_MS = 500
const PAGE_LIMIT = 12

const Products: React.FC = () => {
  const lastItemRef = useRef<HTMLElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState<string>(() => searchParams.get("s") ?? "")

  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({})

  const { data: filtersData, isLoading: isFiltersLoading } = useQuery({
    queryKey: ["product-filters"],
    queryFn: async () => {
      const res = await productService.getFilters()
      return res.data
    },
  })

  const urlFilters = useMemo<FiltersState>(() => {
    const s = searchParams
    return {
      search: s.get("s") ?? undefined,
      categoryId: s.get("c") ?? undefined,
      brandId: s.get("b") ?? undefined,
      // minPrice: s.get("mnp") !== null ? Number(s.get("mnp")) : undefined,
      // maxPrice: s.get("mxp") !== null ? Number(s.get("mxp")) : undefined,
      sort: s.get("sort") ?? undefined,
      order: s.get("order") ?? undefined,
      isFeatured: s.get("sort") === "featured" ? true : undefined,
      isNewArrival: s.get("sort") === "newest" ? true : undefined,
      rating: s.get("rating") ? Number(s.get("rating")) : undefined,
    }
  }, [searchParams])

  useEffect(() => {
    setSelectedFilters(urlFilters)
  }, [urlFilters])

  const categories = filtersData?.categories ?? []
  const brands = filtersData?.brands ?? []
  const minPriceLimit = filtersData?.priceRange?.minPrice ?? 0
  const maxPriceLimit = filtersData?.priceRange?.maxPrice ?? 50000

  useEffect(() => {
    const hasAnyParam = Array.from(searchParams.keys()).length > 0
    if (!hasAnyParam) {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as FiltersState
          if (parsed && Object.keys(parsed).length > 0) {
            const params: Record<string, string> = {}
            Object.entries(parsed).forEach(([k, v]) => {
              if (v === undefined || v === null || v === "") return
              params[k] = String(v)
            })
            setSearchParams(params, { replace: true })
            setSearchInput(parsed.search ?? "")
          }
        }
      } catch { }
    }
  }, [])

  useEffect(() => {
    const persist: any = {}
    for (const key of ["s", "c", "b", "sort", "order", "rating"]) {
      const v = searchParams.get(key)
      if (v == null) continue
      if (["rating"].includes(key)) {
        persist[key] = Number(v)
      } else {
        persist[key] = v
      }
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persist))
    } catch { }
  }, [searchParams])

  useEffect(() => {
    const t = setTimeout(() => {
      updateParam("s", searchInput === "" ? undefined : searchInput)
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  const updateParam = (key: string, value: string | number | boolean | undefined) => {
    const next: Record<string, string> = {}
    for (const [k, v] of searchParams.entries()) next[k] = v

    if (value === undefined || value === null || value === "") delete next[key]
    else next[key] = String(value)

    setSearchParams(next)
  }

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products", urlFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const payload: any = { page: pageParam, limit: PAGE_LIMIT }
      if (urlFilters.search) payload.search = urlFilters.search
      if (urlFilters.categoryId) payload.categoryId = urlFilters.categoryId
      if (urlFilters.brandId) payload.brandId = urlFilters.brandId
      // if (typeof urlFilters.minPrice === "number") payload.minPrice = urlFilters.minPrice
      // if (typeof urlFilters.maxPrice === "number") payload.maxPrice = urlFilters.maxPrice
      if (urlFilters.sort) payload.sort = urlFilters.sort
      if (urlFilters.order) payload.order = urlFilters.order
      if (typeof urlFilters.rating === "number") payload.rating = urlFilters.rating
      const res = await productService.getAll(payload)
      return res.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined
      return lastPage.page >= lastPage.totalPages ? null : lastPage.page + 1
    },
  })

  const products = data?.pages.flatMap((p) => p.products) ?? []
  const totalProducts = data?.pages?.[0]?.total ?? 0

  const { ref, entry } = useIntersection({ root: lastItemRef.current, threshold: 1 })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) fetchNextPage()
  }, [entry, hasNextPage, isFetching])

  const handleResetFilters = () => {
    setSearchParams({})
    setSearchInput("")
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch { }
  }

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Browse our complete collection</p>
        </div>

        <nav className="text-xs sm:text-sm mb-6 sm:mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar - Only visible on desktop with accordion disabled on desktop */}
          <aside className="lg:w-80 space-y-4 hidden lg:block flex-shrink-0">
            <div className="sticky top-6 bg-card border border-border rounded-xl p-6 shadow-sm max-h-[85vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {isFiltersLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                      ))
                      : categories.map((cat: any) => (
                        <div key={cat._id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={urlFilters.categoryId === cat._id}
                            onCheckedChange={() =>
                              updateParam("c", urlFilters.categoryId === cat._id ? undefined : cat._id)
                            }
                            className="w-5 h-5"
                          />
                          <Label className="text-sm cursor-pointer font-normal">{cat.title}</Label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="border-b border-border pb-4">
                  <h3 className="text-sm font-medium mb-3">Brands</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {isFiltersLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                      ))
                      : brands.map((brand: any) => (
                        <div key={brand._id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={urlFilters.brandId === brand._id}
                            onCheckedChange={() =>
                              updateParam("b", urlFilters.brandId === brand._id ? undefined : brand._id)
                            }
                            className="w-5 h-5"
                          />
                          <Label className="text-sm cursor-pointer font-normal">{brand.name}</Label>
                        </div>
                      ))}
                  </div>
                </div>

                {/* <div className="border-b border-border pb-4">
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <Slider
                    min={minPriceLimit}
                    max={maxPriceLimit}
                    value={[Number(urlFilters.minPrice ?? minPriceLimit), Number(urlFilters.maxPrice ?? maxPriceLimit)]}
                    onValueChange={(value) => {
                      const next: Record<string, string> = {}
                      for (const [k, v] of searchParams.entries()) next[k] = v
                      next["mnp"] = String(value[0])
                      next["mxp"] = String(value[1])
                      setSearchParams(next)
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                    <span>₹{urlFilters.minPrice ?? minPriceLimit}</span>
                    <span>₹{urlFilters.maxPrice ?? maxPriceLimit}</span>
                  </div>
                </div> */}

                <div className="pb-4">
                  <h3 className="text-sm font-medium mb-3">Other Filters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={urlFilters.sort === "featured"}
                        onCheckedChange={(c) => updateParam("sort", c ? "featured" : undefined)}
                        className="w-5 h-5"
                      />
                      <Label className="text-sm cursor-pointer font-normal">Featured Items</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={urlFilters.sort === "newArrivals" || urlFilters.sort === "createdAt"}
                        onCheckedChange={(c) => updateParam("sort", c ? "newArrivals" : undefined)}
                        className="w-5 h-5"
                      />
                      <Label className="text-sm cursor-pointer font-normal">New Arrivals</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 bg-transparent"
                      onClick={handleResetFilters}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-6 space-y-4">
              {(selectedFilters.categoryId ||
                selectedFilters.brandId ||
                selectedFilters.sort)
                // (selectedFilters.minPrice && selectedFilters.minPrice !== minPriceLimit) ||
                // (selectedFilters.maxPrice && selectedFilters.maxPrice !== maxPriceLimit)) 
                && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border sm:hidden">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Active Filters</h3>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.categoryId && (
                        <Badge variant="secondary" className="gap-2">
                          {categories.find((c: any) => c._id === selectedFilters.categoryId)?.title}
                          <button onClick={() => updateParam("c", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )}
                      {selectedFilters.brandId && (
                        <Badge variant="secondary" className="gap-2">
                          {brands.find((b: any) => b._id === selectedFilters.brandId)?.name}
                          <button onClick={() => updateParam("b", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )}
                      {/* {selectedFilters.minPrice && selectedFilters.minPrice !== minPriceLimit && (
                        <Badge variant="secondary" className="gap-2">
                          Min: ₹{selectedFilters.minPrice}
                          <button onClick={() => updateParam("mnp", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )}
                      {selectedFilters.maxPrice && selectedFilters.maxPrice !== maxPriceLimit && (
                        <Badge variant="secondary" className="gap-2">
                          Max: ₹{selectedFilters.maxPrice}
                          <button onClick={() => updateParam("mxp", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )} */}
                      {selectedFilters.sort === "featured" && (
                        <Badge variant="secondary" className="gap-2">
                          Featured
                          <button onClick={() => updateParam("sort", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )}
                      {(selectedFilters.sort === "newArrivals" || selectedFilters.sort === "createdAt") && (
                        <Badge variant="secondary" className="gap-2">
                          New Arrivals
                          <button onClick={() => updateParam("sort", undefined)} className="ml-1 hover:opacity-70">
                            ×
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Mobile search bar */}
              <div className="lg:hidden">
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-10 text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                <div className="lg:hidden w-full">
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        onClick={() => setDrawerOpen(true)}
                        className="w-full sm:w-auto h-10 flex items-center gap-2"
                        variant="outline"
                      >
                        <Filter size={18} />
                        <span className="sm:hidden">Filters</span>
                        <span className="hidden sm:inline">Show Filters</span>
                      </Button>
                    </DrawerTrigger>

                    <DrawerContent className="rounded-t-2xl max-h-[90vh]">
                      <div className="flex flex-col h-full">
                        {/* Header with close button */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
                          <DrawerTitle className="text-lg font-semibold">Filters</DrawerTitle>
                          <button
                            onClick={() => setDrawerOpen(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Close filters"
                          >
                            <X size={24} />
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                          <Accordion type="single" collapsible defaultValue="categories" className="space-y-3">

                            <AccordionItem value="categories" className="border-b border-border">
                              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                                Categories
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="py-4 space-y-4 max-h-96 overflow-y-auto">
                                  {isFiltersLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                      <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                                    ))
                                    : categories.map((cat: any) => (
                                      <div key={cat._id} className="flex items-center space-x-3">
                                        <Checkbox
                                          checked={urlFilters.categoryId === cat._id}
                                          onCheckedChange={() =>
                                            updateParam(
                                              "c",
                                              urlFilters.categoryId === cat._id ? undefined : cat._id,
                                            )
                                          }
                                          className="w-5 h-5"
                                        />
                                        <Label className="text-base cursor-pointer font-normal">{cat.title}</Label>
                                      </div>
                                    ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="brands" className="border-b border-border">
                              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                                Brands
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="py-4 space-y-4 max-h-96 overflow-y-auto">
                                  {isFiltersLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                      <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                                    ))
                                    : brands.map((brand: any) => (
                                      <div key={brand._id} className="flex items-center space-x-3">
                                        <Checkbox
                                          checked={urlFilters.brandId === brand._id}
                                          onCheckedChange={() =>
                                            updateParam(
                                              "b",
                                              urlFilters.brandId === brand._id ? undefined : brand._id,
                                            )
                                          }
                                          className="w-5 h-5"
                                        />
                                        <Label className="text-base cursor-pointer font-normal">{brand.name}</Label>
                                      </div>
                                    ))}
                                </div>
                              </AccordionContent>``
                            </AccordionItem>

                            {/* <AccordionItem value="price" className="border-b border-border">
                              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                                Price Range
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="py-4">
                                  <Slider
                                    min={minPriceLimit}
                                    max={maxPriceLimit}
                                    value={[
                                      Number(urlFilters.minPrice ?? minPriceLimit),
                                      Number(urlFilters.maxPrice ?? maxPriceLimit),
                                    ]}
                                    onValueChange={(value) => {
                                      const next: Record<string, string> = {}
                                      for (const [k, v] of searchParams.entries()) next[k] = v
                                      next["mnp"] = String(value[0])
                                      next["mxp"] = String(value[1])
                                      setSearchParams(next)
                                    }}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-muted-foreground mt-4 font-medium">
                                    <span>₹{urlFilters.minPrice ?? minPriceLimit}</span>
                                    <span>₹{urlFilters.maxPrice ?? maxPriceLimit}</span>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem> */}

                            <AccordionItem value="others" className="border-b border-border">
                              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                                Other Filters
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="py-4 space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={urlFilters.sort === "featured"}
                                      onCheckedChange={(c) => updateParam("sort", c ? "featured" : undefined)}
                                      className="w-5 h-5"
                                    />
                                    <Label className="text-base cursor-pointer font-normal">Featured Items</Label>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={urlFilters.sort === "newArrivals" || urlFilters.sort === "createdAt"}
                                      onCheckedChange={(c) => updateParam("sort", c ? "newArrivals" : undefined)}
                                      className="w-5 h-5"
                                    />
                                    <Label className="text-base cursor-pointer font-normal">New Arrivals</Label>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Sticky footer with action buttons */}
                        <div className="border-t border-border bg-background p-6 sticky bottom-0">
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 h-12 font-semibold text-base bg-transparent"
                              onClick={() => {
                                handleResetFilters()
                                setDrawerOpen(false)
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              className="flex-1 h-12 font-semibold text-base"
                              onClick={() => setDrawerOpen(false)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

                <div className="hidden lg:block flex-1 max-w-md">
                  <Input
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-10 "
                  />
                </div>
                {/* Sort and product count */}
                <div className="flex items-center justify-between gap-2 w-full sm:gap-4 sm:w-auto">
                  <p className="text-sm text-muted-foreground whitespace-nowrap">{totalProducts} products</p>

                  <Select
                    defaultValue={urlFilters.sort ?? "newest"}
                    onValueChange={(value) => {
                      // if (value === "price_low") {
                      //   updateParam("sort", "price")
                      //   updateParam("order", "asc")
                      // } else if (value === "price_high") {
                      //   updateParam("sort", "price")
                      //   updateParam("order", "desc")
                      // } else 
                        if (value === "newest") {
                        updateParam("sort", "createdAt")
                        updateParam("order", "desc")
                      } else {
                        updateParam("sort", value)
                      }
                    }}
                  >
                    <SelectTrigger className="h-10 text-sm w-44">
                      <SelectValue defaultValue="newest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="bestSelling">Best Selling</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      {/* <SelectItem value="price_low">Price: Low → High</SelectItem> */}
                      {/* <SelectItem value="price_high">Price: High → Low</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
                <div ref={ref} className="h-1" />
                {(isFetchingNextPage || isFetching) && (
                  <div className="col-span-full flex justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="animate-spin h-6 w-6 text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className="text-sm text-muted-foreground">Loading more products...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products
