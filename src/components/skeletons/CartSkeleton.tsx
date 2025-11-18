export default function CartSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
      <div className="lg:col-span-2 space-y-3 sm:space-y-4">
        <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border">
          <div className="p-3 sm:p-4 border-b">
            <div className="h-5 sm:h-6 shimmer rounded w-32 sm:w-48" />
          </div>
          <ul className="divide-y">
            {[1, 2, 3].map((i) => (
              <li key={i} className="p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-4">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 shimmer rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 shimmer rounded w-3/4" />
                    <div className="h-3 sm:h-4 shimmer rounded w-20" />
                    <div className="h-4 sm:h-5 shimmer rounded w-24" />
                    <div className="flex gap-2">
                      <div className="h-8 sm:h-10 shimmer rounded w-24 sm:w-32" />
                      <div className="h-8 sm:h-10 shimmer rounded w-16 sm:w-20" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="h-5 sm:h-6 shimmer rounded w-32" />
          <div className="space-y-2 sm:space-y-3">
            <div className="h-4 shimmer rounded" />
            <div className="h-4 shimmer rounded" />
          </div>
          <div className="border-t pt-3">
            <div className="h-6 sm:h-8 shimmer rounded mb-3 sm:mb-4" />
            <div className="h-12 sm:h-14 shimmer rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
