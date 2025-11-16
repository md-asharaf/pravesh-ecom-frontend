import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Quality Construction Materials Delivered
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Premium steel, roofing sheets, TMT bars, and construction hardware at competitive prices. 
            Building trust, one project at a time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" asChild className="font-semibold">
              <Link to="/products">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild className="bg-background/10 border-primary-foreground text-primary-foreground hover:bg-background/20">
              <Link to="/categories">
                Browse Categories
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
