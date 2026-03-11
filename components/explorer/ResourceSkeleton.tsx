import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResourceCardSkeleton() {
    return (
        <Card className="relative h-full flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0 rounded-2xl shadow-sm">
            {/* Header/Image Area */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Skeleton className="w-full h-full rounded-none opacity-40" />
                <div className="absolute top-4 left-5 z-20">
                    <Skeleton className="h-5 w-16 rounded-md opacity-20" />
                </div>
            </div>

            {/* Content Area */}
            <CardHeader className="px-5 py-5 gap-2">
                <Skeleton className="h-6 w-[80%] rounded-md opacity-40" />
                <Skeleton className="h-4 w-[40%] rounded-md opacity-20" />
                <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-full rounded-md opacity-20" />
                    <Skeleton className="h-4 w-[90%] rounded-md opacity-20" />
                </div>
            </CardHeader>

            {/* Footer Area */}
            <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                <Skeleton className="h-10 w-full rounded-xl opacity-20" />
            </CardFooter>
        </Card>
    );
}

export function ResourceGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-12">
            {Array.from({ length: count }).map((_, i) => (
                <ResourceCardSkeleton key={i} />
            ))}
        </div>
    );
}
