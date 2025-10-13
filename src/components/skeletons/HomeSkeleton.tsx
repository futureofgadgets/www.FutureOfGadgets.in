export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      <section className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="h-[280px] bg-gray-200 rounded-lg mt-3 sm:mt-4" />
          <div className="flex items-center justify-center gap-2 my-3 sm:my-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </section>
      <div className="space-y-4 sm:space-y-8">
        {[1, 2, 3].map((section) => (
          <section key={section} className="py-6 sm:py-10">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="space-y-2">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-36" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 sm:w-20" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden border">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-2 sm:p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
