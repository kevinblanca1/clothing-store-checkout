import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold tracking-tight text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. It may have been moved
        or no longer exists.
      </p>
      <Button className="mt-6" asChild>
        <Link to="/">
          <Home /> Back to homepage
        </Link>
      </Button>
    </div>
  );
}
