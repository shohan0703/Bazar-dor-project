// components/ProductSkeleton.tsx

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-pulse">
      
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
      
     
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      
      
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  );
}


export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
    </div>
  );
}