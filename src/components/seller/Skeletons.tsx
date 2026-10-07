"use client";

export function ProductCardSkeleton() {
  return (
    <div className="border border-line bg-paper p-4 sm:p-5 animate-pulse">
      <div className="aspect-square w-full bg-bone mb-4" />
      <div className="h-3 w-1/3 bg-bone mb-2" />
      <div className="h-4 w-4/5 bg-bone mb-3" />
      <div className="h-3 w-1/2 bg-bone" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="border border-line bg-paper p-5 animate-pulse">
      <div className="h-3 w-1/2 bg-bone mb-3" />
      <div className="h-7 w-1/3 bg-bone" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="border border-line bg-paper p-4 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 bg-bone shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 bg-bone" />
        <div className="h-3 w-1/3 bg-bone" />
      </div>
    </div>
  );
}
