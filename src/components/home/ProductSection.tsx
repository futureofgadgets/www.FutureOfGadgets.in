import Link from "next/link";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductSection({ title, products, viewAllLink = "/products" }: ProductSectionProps) {
  return (
    <section className="pt-5 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-[1400px] sm:px-6">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <Link href={viewAllLink} scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 sm:gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
