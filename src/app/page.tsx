"use client";

import Link from "next/link";
import { popularProducts } from "@/lib/data/popular-products";
import HeaderSlider from "@/components/home/HomeSlider";
import ProductCard from "@/components/product-card";
import { Footer } from "@/components/Footer";
import ShopByBrands from "@/components/home/ShopByBrands";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {

  const extraData = [
  {
    title: "Free Delivery",
    description: "Free shipping over $100",
    icon: <Truck size={45} />,
  },
  {
    title: "Free Return",
    description: "Free shipping over $100",
    icon: <GitCompareArrows size={45} />,
  },
  {
    title: "Customer Support",
    description: "Friendly 27/7 customer support",
    icon: <Headset size={45} />,
  },
  {
    title: "Money Back guarantee",
    description: "Quality checked by our team",
    icon: <ShieldCheck size={45} />,
  },
];


  return (
    <main className="min-h-screen  mx-auto bg-white dark:bg-gray-900">
      
      {/* Hero Slider */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <HeaderSlider />
        </div>
      </section>
      

      {/* Quick Categories */}
      <section className="border-b border-gray-100 dark:border-gray-700 py-6">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
            {[
              { name: "Laptops", href: "/category/laptops" },
              { name: "Keyboards", href: "/category/keyboards" },
              { name: "Mouse", href: "/category/mouse" },
              { name: "Accessories", href: "/category/laptop-accessories" },
              { name: "See All", href: "/category/" },
            ].map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <div className="min-w-[110px] bg-gray-50 dark:bg-gray-900 rounded-full  p-3 text-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-white dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all cursor-pointer">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pt-5 ">
        <div className="mx-auto max-w-[1400px] sm:px-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white ">Featured Products</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-12 ">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-10">
        <div className="mx-auto max-w-[1400px] px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/category/laptops" className="relative overflow-hidden rounded bg-slate-900 p-6 sm:p-8 md:p-12 hover:opacity-95 transition-opacity">
              <div className="relative z-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">LAPTOPS</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Up to 40% Off</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">Premium brands at best prices</p>
                <span className="hidden sm:inline-flex items-center text-white font-semibold text-xs sm:text-sm border-b-2 border-white pb-1">Shop Now →</span>
              </div>
            </Link>
            <Link href="/category/monitors" className="relative overflow-hidden rounded bg-blue-600 p-6 sm:p-8 md:p-12 hover:opacity-95 transition-opacity">
              <div className="relative z-10">
                <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1 sm:mb-2">MONITORS</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Starting ₹5,999</h3>
                <p className="text-blue-50 text-xs sm:text-sm mb-4 sm:mb-6">Full HD & 4K displays</p>
                <span className="hidden sm:inline-flex items-center text-white font-semibold text-xs sm:text-sm border-b-2 border-white pb-1">Explore →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="pt-5">
        <div className="mx-auto max-w-[1400px] sm:px-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white ">Best Sellers</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-12">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands */}
     <ShopByBrands/>
      

      {/* Trending Now */}
        <section className="pt-5 ">
        <div className="mx-auto max-w-[1400px] sm:px-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white ">Trending Now</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">View All</Link>
          </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-12">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-10">
         <div className="mx-auto max-w-[1400px] sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deal of the Day</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Limited time offers</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ends in 12h 30m</span>
            </div>
          </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-12">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-5">
        <div className="mx-auto max-w-[1400px] sm:px-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white ">New Arrivals</h2>
            <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">View All</Link>
          </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 sm:gap-12">
            {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


<div className="mx-auto max-w-[1400px] sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 p-2 py-5">
        {extraData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group "
          >
            <span className="inline-flex scale-100 hover:text-[#3eb96d]">
              {item?.icon}
            </span>
            <div className="text-sm">
              <p className="text-darkColor/80 font-bold capitalize">
                {item?.title}
              </p>
              <p className="text-lightColor">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
</div>
      {/* Footer */}
      <Footer />
    </main>
  );
}
