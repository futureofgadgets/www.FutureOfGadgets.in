export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border p-3 sm:p-6 mb-3 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mx-auto sm:mx-0" />
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-40 sm:w-56 mx-auto sm:mx-0" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-36 sm:w-44 mx-auto sm:mx-0" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="h-9 sm:h-10 bg-gray-200 rounded-lg flex-1 sm:flex-none sm:w-24" />
              <div className="h-9 sm:h-10 bg-gray-200 rounded-lg flex-1 sm:flex-none sm:w-24" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="lg:col-span-2 bg-white sm:rounded-lg sm:shadow-sm sm:border p-3 sm:p-6">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-40 sm:w-48 mb-3 sm:mb-6" />
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24" />
                  <div className="h-8 sm:h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white sm:rounded-lg sm:shadow-sm sm:border p-3 sm:p-6">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40 mb-3 sm:mb-6" />
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-2.5 sm:p-4 space-y-2">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
