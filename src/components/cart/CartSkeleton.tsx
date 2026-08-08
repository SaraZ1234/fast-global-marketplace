export default function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
      <div className="lg:col-span-8 border border-line divide-y divide-line">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 sm:p-6 flex gap-4 sm:gap-6 animate-pulse">
            <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 bg-bone" />
            <div className="flex-1 min-w-0 space-y-3 py-1">
              <div className="h-3 w-24 bg-bone" />
              <div className="h-4 w-3/5 bg-bone" />
              <div className="h-3 w-32 bg-bone" />
            </div>
            <div className="hidden sm:flex flex-col items-end gap-3 py-1">
              <div className="h-3 w-16 bg-bone" />
              <div className="h-9 w-28 bg-bone" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-4">
        <div className="border border-ink p-6 sm:p-7 animate-pulse">
          <div className="h-4 w-32 bg-bone" />
          <div className="mt-6 space-y-4">
            <div className="h-3 w-full bg-bone" />
            <div className="h-3 w-full bg-bone" />
            <div className="h-3 w-2/3 bg-bone" />
          </div>
          <div className="mt-6 h-px w-full bg-line" />
          <div className="mt-6 h-5 w-1/2 bg-bone" />
          <div className="mt-8 h-11 w-full bg-bone" />
          <div className="mt-3 h-11 w-full bg-bone" />
        </div>
      </div>
    </div>
  );
}