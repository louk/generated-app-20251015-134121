import { Skeleton } from '@/components/ui/skeleton';
export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-48" />
        <div className="pt-4 space-y-2">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="pt-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="pt-4">
          <Skeleton className="h-12 w-48 rounded-md" />
        </div>
      </div>
    </div>
  );
}