import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResourceCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden border-muted/50 bg-card shadow-sm">
            <CardHeader className="p-0 relative aspect-[2/3] bg-muted/10 overflow-hidden flex items-center justify-center border-b border-muted/5">
                <Skeleton className="w-full h-full rounded-none" />
                <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                    <Skeleton className="h-3 w-10" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-1.5 pt-1 space-y-1.5">
                <Skeleton className="h-3 w-[90%]" />
                <Skeleton className="h-3 w-[70%]" />
                <div className="space-y-1 mt-1">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ResourceGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 px-4 pb-12">
            {Array.from({ length: count }).map((_, i) => (
                <ResourceCardSkeleton key={i} />
            ))}
        </div>
    );
}
