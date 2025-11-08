import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await blogService.getPostBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>January 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
            </div>
            {blog.tags && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {blog.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {blog.content}
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Understanding TMT Bars</h2>
                <p className="text-foreground leading-relaxed">
                  Thermo-Mechanically Treated (TMT) bars are high-strength reinforcement bars with a tough outer core
                  and a soft inner core. They are extensively used in construction for their superior strength and
                  flexibility. When selecting TMT bars, consider factors like grade (Fe 415, Fe 500, Fe 550),
                  corrosion resistance, and certification standards.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Key Considerations</h2>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>Grade selection based on structural requirements</li>
                  <li>Checking for BIS certification and quality marks</li>
                  <li>Evaluating corrosion resistance properties</li>
                  <li>Considering bendability and ductility</li>
                  <li>Verifying manufacturer reputation</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
                <p className="text-foreground leading-relaxed">
                  Choosing the right TMT bar is crucial for ensuring the longevity and safety of your construction
                  project. Always purchase from reputable suppliers and verify certifications. SteelMart offers a
                  wide range of certified TMT bars from top manufacturers at competitive prices.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link to="/products?cat=7">
                Shop TMT Bars
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
