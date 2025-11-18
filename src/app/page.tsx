"use client";

import { useState, useEffect } from "react";
import HeaderSlider from "@/components/home/HomeSlider";
import { Footer } from "@/components/Footer";
import ShopByBrands from "@/components/home/ShopByBrands";
import PopularCategories from "@/components/home/PopularCategories";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import BestSeller from "@/components/home/BestSeller";
import TrendingNow from "@/components/home/TrendingNow";
import DealoftheDay from "@/components/home/DealoftheDay";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedSection from "@/components/home/FeaturedSection";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";
import Laptopcarousal from "@/components/home/laptop-carousal";
import CustomerReview from "@/components/home/CustomerReview";
import Loading from "./loading";
import AlwaysWithYou from "@/components/home/AlwaysWithYou";
import YoutubeSection from "@/components/home/YoutubeSection";

export default function HomePage() {
  // TESTING: Artificial loading delay - Remove for production
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading/>;
  }
  


  const extraData = [
    {
      title: "Free Delivery",
      description: "Free shipping on orders over $100",
      icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Free Returns",
      description: "7-day return policy",
      icon: <GitCompareArrows className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Customer Support",
      description: "Friendly 24/7 customer support",
      icon: <Headset className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
    {
      title: "Money Back Guarantee",
      description: "Quality checked by our team",
      icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50/5">
      {/* Hero Slider */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] sm:px-6 sm:pb-6">
          <HeaderSlider />
        </div>
      </section>
      <div className="space-t-4 sm:space-t-8">
        <Laptopcarousal />
        <DealoftheDay />
        <NewArrivals />
        <FeaturedSection/>
        <PopularCategories />
        <PromotionalBanner />
        <BestSeller />
        <ShopByBrands />
        <TrendingNow />
        <AlwaysWithYou />
        <YoutubeSection />
        <CustomerReview/>
      </div>
      <Footer />
    </main>
  );
}
