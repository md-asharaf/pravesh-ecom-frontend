import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts, mockCategories, mockBrands } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const Products = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                  {mockCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox id={`cat-${cat.id}`} />
                      <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                        {cat.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Brands</h3>
                <div className="space-y-2">
                  {mockBrands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox id={`brand-${brand.id}`} />
                      <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                        {brand.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="in-stock" />
                    <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">
                      Featured
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
                      On Sale
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
                Showing {mockProducts.length} products
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
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
