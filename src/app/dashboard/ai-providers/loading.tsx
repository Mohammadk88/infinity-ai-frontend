'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function AIProvidersLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
      
      <Skeleton className="h-[200px] w-full rounded-md" />
    </div>
  );
}
