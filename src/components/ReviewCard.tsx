import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="bg-gradient-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="text-foreground mb-4 italic">"{review.comment}"</p>
        <p className="text-sm font-semibold text-muted-foreground">— {review.user}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
