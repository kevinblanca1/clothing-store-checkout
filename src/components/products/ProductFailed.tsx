import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

export function ProductFailed({ error, onRetry }: { error: string, onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error ?? "Something went wrong."}</p>
            <Button onClick={onRetry}>Try again</Button>
        </div>
    );
}