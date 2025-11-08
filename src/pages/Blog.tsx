import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
const Blog = () => {
  const lastBlogRef = useRef<HTMLDivElement>(null);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs"],
    queryFn: async ({ pageParam }) => {
      const response = await blogService.getAllPosts({
        limit: 12,
        page: pageParam,
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.blogs.length === 12 ? allPages.length + 1 : null;
    },
  });
  const blogs = data?.pages?.flatMap((page) => page.blogs) ?? [];
  const { ref, entry } = useIntersection({
    root: lastBlogRef.current,
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8" ref={lastBlogRef}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Construction tips, guides, and industry insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.slug} to={`/blog/${blog.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-card h-full">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>January 15, 2024</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  {blog.tags && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div ref={ref} className="h-1" />

        {(isFetchingNextPage || isFetching) && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
