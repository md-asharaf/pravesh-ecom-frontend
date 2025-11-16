import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

const Index = () => {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryService.getAll({ page: 1, limit: 12, isParent: true })
      return response.data;
    },
  });

  const categories = categoriesData?.categories || [];
  const { data: featuredProductsData } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await productService.getAll({ page: 1, limit: 12, isFeatured: true })
      return response.data;
    },
  });
  const featuredProducts = featuredProductsData?.products || [];

  const { data: bestSellingData } = useQuery({
    queryKey: ["best-selling-products"],
    queryFn: async () => {
      const response = await productService.getAll({ page: 1, limit: 8, sort: 'bestSelling' })
      return response?.data;
    },
  });
  const bestSelling = bestSellingData?.products || [];

  const { data: newArrivalsData } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const response = await productService.getAll({ page: 1, limit: 8, isNewArrival: true })
      return response?.data;
    },
  });
  const newArrivals = newArrivalsData?.products || [];

  const { data: trendingData } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const response = await productService.getAll({ page: 1, limit: 8, sort: 'trending' })
      return response?.data;
    },
  });
  const trending = trendingData?.products || [];

  return (
    <>
      <Hero />

      {/* Features */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Best Prices</h3>
                <p className="text-sm text-muted-foreground">Competitive rates guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">Premium construction materials</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">On-time delivery to your site</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
            <Button variant="ghost" asChild>
              <Link to="/categories">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      {featuredProducts.length > 0 && <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=featured">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {/* Best Selling Products */}
      {bestSelling.length > 0 && <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Best Selling</h2>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=bestSelling">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSelling.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {/* Trending Products */}
      {trending.length > 0 && <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Trending Products</h2>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=trending">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
      }

      {/* New Arrivals */}
      {newArrivals.length > 0 && <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">New Arrivals</h2>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=newArrivals">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Get the best construction materials delivered to your site. Quality guaranteed.
          </p>
          <Button size="lg" variant="secondary" asChild className="font-semibold">
            <Link to="/products">
              Browse Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-industrial text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SteelMart</h3>
              <p className="text-sm text-primary-foreground/80">
                Your trusted partner for quality construction materials.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="hover:text-accent transition-colors">Products</Link></li>
                <li><Link to="/categories" className="hover:text-accent transition-colors">Categories</Link></li>
                <li><Link to="/brands" className="hover:text-accent transition-colors">Brands</Link></li>
                <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-accent transition-colors">Returns</Link></li>
                <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Email: info@steelmart.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Mumbai, India</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2024 SteelMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
