import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { mockProducts, mockReviews } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = mockProducts.find((p) => p.slug === slug);
  const relatedProducts = mockProducts.filter((p) => p.cat === product?.cat && p.id !== product?.id).slice(0, 4);
  const productReviews = mockReviews.filter((r) => r.product === product?.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.imgs[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {product.discType === "percentage" ? `${product.discVal}% OFF` : `₹${product.discVal} OFF`}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.imgs.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0) ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
              <span className="text-sm text-muted-foreground">
                {product.sold} sold
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">₹{product.final.toLocaleString()}</span>
              {product.discount && (
                <span className="text-xl text-muted-foreground line-through">₹{product.orig.toLocaleString()}</span>
              )}
              <span className="text-sm text-muted-foreground">per {product.unit}</span>
            </div>

            <Badge
              variant={product.stockStatus === "in_stock" ? "secondary" : "destructive"}
              className="text-base px-4 py-1"
            >
              {product.stockStatus === "in_stock" ? `In Stock (${product.stock} ${product.unit}s)` : product.stockStatus === "low_stock" ? "Low Stock" : "Out of Stock"}
            </Badge>

            <p className="text-foreground leading-relaxed">{product.desc}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-6 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stockStatus === "out_of_stock"}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToWishlist}>
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">2-3 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Quality Assured</p>
                  <p className="text-xs text-muted-foreground">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-foreground leading-relaxed">{product.desc}</p>
                {product.tags && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="font-semibold">SKU:</dt>
                    <dd className="text-muted-foreground">{product.sku}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="font-semibold">Unit:</dt>
                    <dd className="text-muted-foreground">{product.unit}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="font-semibold">Stock Status:</dt>
                    <dd className="text-muted-foreground capitalize">{product.stockStatus.replace("_", " ")}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="font-semibold">Available Stock:</dt>
                    <dd className="text-muted-foreground">{product.stock} {product.unit}s</dd>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <dt className="font-semibold">Brand:</dt>
                      <dd className="text-muted-foreground">{product.brand}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground mb-2">{review.comment}</p>
                      <p className="text-sm font-semibold text-muted-foreground">— {review.user}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
