import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";

const Products = () => {
  const lastProductRef = useRef(null);
  const { data: filtersData } = useQuery({
    queryKey: ["product-filters"],
    queryFn: async () => {
      const response = await productService.getFilters()
      return response.data;
    }
  })
  const filters = filtersData || {
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: {
      minPrice: 0,
      maxPrice: 1000
    }
  };
  const categories = filters?.categories || [];
  const brands = filters?.brands || [];
  // const colors = filters?.colors || [];
  // const sizes = filters?.sizes || [];
  const minPrice = filters?.priceRange.minPrice || 0;
  const maxPrice = filters?.priceRange.maxPrice || 1000;

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const response = await productService.getAll({
        limit: 12,
        page: pageParam,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.products.length === 12 ? allPages.length + 1 : null;
    },
  });
  const products = data?.pages?.flatMap((page) => page.products) ?? [];
  const totalProducts = data?.pages?.[0]?.total ?? 0;
  const { ref, entry } = useIntersection({
    root: lastProductRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of construction materials</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Search</h3>
                <Input placeholder="Search products..." />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat._id} className="flex items-center space-x-2">
                      <Checkbox id={`cat-${cat._id}`} />
                      <Label htmlFor={`cat-${cat._id}`} className="text-sm cursor-pointer">
                        {cat.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center space-x-2">
                      <Checkbox id={`brand-${brand._id}`} />
                      <Label htmlFor={`brand-${brand._id}`} className="text-sm cursor-pointer">
                        {brand.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  // onValueChange={(value) => }
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{filters.priceRange.minPrice}</span>
                  <span>₹{filters.priceRange.maxPrice}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="space-y-2">
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox id="in-stock" />
                    <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock
                    </Label>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">
                      Featured
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="trending" />
                    <Label htmlFor="trending" className="text-sm cursor-pointer">
                      Trending
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new" />
                    <Label htmlFor="new" className="text-sm cursor-pointer">
                      New Arrivals
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="discount" />
                    <Label htmlFor="discount" className="text-sm cursor-pointer">
                      Best Sellers
                    </Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {totalProducts} products
              </p>
              <Select defaultValue="featured">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              <div ref={ref} className="h-1" />

              {(isFetchingNextPage || isFetching) && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Loading more...
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
};

export default Products;