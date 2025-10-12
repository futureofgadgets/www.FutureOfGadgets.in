import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import Title from "../ui/Title";

const brands = [
  { name: "Apple", image: "/brand/Apple.png" },
  { name: "Asus", image: "/brand/Asus.png" },
  { name: "Dell", image: "/brand/dell.png" },
  { name: "HP", image: "/brand/hp.webp" },
  { name: "Lenovo", image: "/brand/lenovo.png" },
  { name: "Samsung", image: "/brand/samsung.png" },
  { name: "Sony", image: "/brand/acer.png" },
];

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



const ShopByBrands = () => {
  return (
    <div className="mt-5 p-5 lg:p-7 rounded-md mx-auto max-w-[1400px] sm:px-6">
      <div className="flex items-center gap-5 justify-between mb-10">
        <Title>Shop By Brands</Title>
        <Link href="/products" scroll={true} className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">View All</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href="/products"
            className="bg-white w-full h-24 flex items-center justify-center rounded-md overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={brand.image}
              alt={brand.name}
              width={250}
              height={250}
              className="w-32 h-20 object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
