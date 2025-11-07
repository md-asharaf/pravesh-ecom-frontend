import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { mockBrands, mockProducts } from "@/data/mockData";
import { Link } from "react-router-dom";

const Brands = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Brands</h1>
          <p className="text-muted-foreground">
            Shop from trusted construction material brands
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {mockBrands.map((brand) => {
            const productCount = mockProducts.filter((p) => p.brand === brand.id).length;
            return (
              <Link key={brand.id} to={`/products?brand=${brand.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <div className="h-24 flex items-center justify-center mb-4">
                      <img
                        src={brand.img}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {productCount} products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Brands;
