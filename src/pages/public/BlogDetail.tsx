import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import { Loader } from "@/components/Loader";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await blogService.getPostBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
  if (isLoading) {
    return <Loader />
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Button onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
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
              <div className="text-foreground leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default BlogDetail;
