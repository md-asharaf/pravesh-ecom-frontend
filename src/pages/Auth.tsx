import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild className="text-primary-foreground hover:text-primary-foreground/80">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to SteelMart</CardTitle>
          <CardDescription className="text-center">Choose Login or Register to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
