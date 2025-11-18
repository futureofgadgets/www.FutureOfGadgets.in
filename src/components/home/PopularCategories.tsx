"use client"
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const categoryData = [
  { name: "Regular Use Laptop's", image: "/category/regular_laptop.jpg", href: "/search?q=regular-laptop" },
  { name: "Office Use Laptop's", image: "/category/office_laptop.jpg", href: "/search?q=office-laptop" },
  { name: "Premium Laptop's", image: "/category/pro_laptop.jpg", href: "/search?q=pro-laptop" },
  { name: "Touch 4K Laptop's", image: "/category/touchscreen.png", href: "/search?q=touch-laptop" },
  { name: "Gaming Laptop's", image: "/category/best-gaming-laptop.jpg", href: "/search?q=gaming-laptop" },
  { name: "Light & Slim Laptop's", image: "/category/ultra_thin_laptop.jpg", href: "/search?q=slim-laptop" },
];


export default function PopularCategories() {
  const [categories, setCategories] = useState(categoryData.map(c => ({ ...c, count: 0 })));

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        const counts = categoryData.map(cat => {
          const count = products.filter((p: any) => 
            p.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;
          return { ...cat, count };
        });
        setCategories(counts);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="py-6">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="border border-[#c1e5cf] rounded-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 pb-2 sm:pb-3 border-b border-[#c1e5cf] ">
              Popular Categories
            </h2>
          </div>

           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link target="blank"
                key={category.name}
                href={category.href}
                className="bg-[#f6f6f6] p-3 sm:p-5 rounded-lg hover:bg-[#e7e7e7] hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white  border-2 border-gray-200 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#4a5f52] font-medium group-hover:gap-2 transition-all">
                      Shop Now <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/category/"
              className="bg-[#f6f6f6] p-3 sm:p-5 rounded-lg hover:bg-[#e7e7e7] hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0 rounded-lg">
                  <div className="flex flex-col items-center justify-center text-[#4a5f52] ">
                    <ArrowRight size={24} className="sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform" />
                    <span className="text-[10px] sm:text-xs font-semibold mt-0.5">See All</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 truncate">
                    See All
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 ">
                    All items
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
