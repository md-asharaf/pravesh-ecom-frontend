import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Categories</h1>
          <p className="text-muted-foreground">
            Browse construction materials by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockCategories.map((category) => {
            const productCount = mockProducts.filter((p) => p.cat === category.id).length;
            return (
              <div key={category.id} className="relative">
                <CategoryCard category={category} />
                <div className="mt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    {productCount} products
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
