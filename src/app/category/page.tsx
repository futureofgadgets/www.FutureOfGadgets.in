"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function ElectronicsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fakeProducts = {
    laptops: [
      {
        name: 'MacBook Pro 16"',
        price: "$2,399",
        originalPrice: "$2,599",
        rating: 4.8,
        reviews: 1247,
        image: "💻",
        badge: "Best Seller",
      },
      {
        name: "Dell XPS 13 Plus",
        price: "$1,299",
        originalPrice: "$1,499",
        rating: 4.6,
        reviews: 892,
        image: "💻",
        badge: "New",
      },
      {
        name: "HP Spectre x360",
        price: "$1,199",
        originalPrice: null,
        rating: 4.5,
        reviews: 634,
        image: "💻",
        badge: null,
      },
      {
        name: "Lenovo ThinkPad X1",
        price: "$1,899",
        originalPrice: "$2,099",
        rating: 4.7,
        reviews: 456,
        image: "💻",
        badge: "Sale",
      },
    ],
    smartphones: [
      {
        name: "iPhone 15 Pro",
        price: "$999",
        originalPrice: null,
        rating: 4.9,
        reviews: 2341,
        image: "📱",
        badge: "Best Seller",
      },
      {
        name: "Samsung Galaxy S24",
        price: "$799",
        originalPrice: "$899",
        rating: 4.7,
        reviews: 1876,
        image: "📱",
        badge: "Sale",
      },
      {
        name: "Google Pixel 8",
        price: "$699",
        originalPrice: null,
        rating: 4.6,
        reviews: 1234,
        image: "📱",
        badge: "New",
      },
      {
        name: "OnePlus 12",
        price: "$799",
        originalPrice: "$849",
        rating: 4.5,
        reviews: 987,
        image: "📱",
        badge: null,
      },
    ],
    headphones: [
      {
        name: "AirPods Pro (2nd Gen)",
        price: "$249",
        originalPrice: "$279",
        rating: 4.8,
        reviews: 3456,
        image: "🎧",
        badge: "Best Seller",
      },
      {
        name: "Sony WH-1000XM5",
        price: "$399",
        originalPrice: "$429",
        rating: 4.9,
        reviews: 2134,
        image: "🎧",
        badge: "Editor's Choice",
      },
      {
        name: "Bose QuietComfort",
        price: "$329",
        originalPrice: null,
        rating: 4.7,
        reviews: 1567,
        image: "🎧",
        badge: null,
      },
      {
        name: "Sennheiser Momentum 4",
        price: "$379",
        originalPrice: "$399",
        rating: 4.6,
        reviews: 892,
        image: "🎧",
        badge: "Sale",
      },
    ],
  };

  const categories = [
    {
      name: "Laptops",
      slug: "laptops",
      icon: "💻",
      count: "2,341 items",
      description: "High-performance laptops",
    },
    {
      name: "Smartphones",
      slug: "smartphones",
      icon: "📱",
      count: "1,876 items",
      description: "Latest mobile devices",
    },
    {
      name: "Headphones",
      slug: "headphones",
      icon: "🎧",
      count: "1,234 items",
      description: "Premium audio gear",
    },
    {
      name: "Tablets",
      slug: "tablets",
      icon: "📱",
      count: "987 items",
      description: "Portable computing",
    },
    {
      name: "Monitors",
      slug: "monitors",
      icon: "🖥️",
      count: "756 items",
      description: "Professional displays",
    },
    {
      name: "Keyboards",
      slug: "keyboards",
      icon: "⌨️",
      count: "543 items",
      description: "Mechanical & wireless",
    },
    {
      name: "Cameras",
      slug: "cameras",
      icon: "📷",
      count: "432 items",
      description: "DSLR & mirrorless",
    },
    {
      name: "Gaming",
      slug: "gaming",
      icon: "🎮",
      count: "1,567 items",
      description: "Consoles & accessories",
    },
    // { name: "Smart Home", slug: "smart-home", icon: "🏠", count: "892 items", description: "IoT devices" },
    {
      name: "Accessories",
      slug: "accessories",
      icon: "🔌",
      count: "2,134 items",
      description: "Cables & chargers",
    },
    // { name: "Wearables", slug: "wearables", icon: "⌚", count: "678 items", description: "Smart watches & fitness" }
  ];

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "Best Seller":
        return "bg-orange-100 text-orange-800";
      case "New":
        return "bg-green-100 text-green-800";
      case "Sale":
        return "bg-red-100 text-red-800";
      case "Editor's Choice":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto py-8">
        {/* Mobile Menu Button */}
        <div className="xl:hidden mb-4 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            Categories
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Enhanced Sidebar */}
          <div className="hidden xl:block w-72 flex-shrink-0">
            <div className="fixed top-16 h-full w-72 space-y-6 overflow-y-auto border-r bg-white">
              {/* Categories Card */}
              <div className="border-0 py-0">
                <div className="p-0">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-gray-900">
                        Categories
                      </h3>
                      {selectedCategory && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 h-auto text-sm"
                        >
                          View All
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-1">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat.slug;
                        return (
                          <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`group w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                              isActive
                                ? "bg-gradient-to-r border-blue-500 bg-blue-50 text-blue-600 "
                                : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 border-transparent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isActive
                                      ? "bg-white/20"
                                      : "bg-gray-100 group-hover:bg-gray-200"
                                  }`}
                                >
                                  <span className="text-lg">{cat.icon}</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">
                                    {cat.name}
                                  </div>
                                  <div
                                    className={`text-xs ${
                                      isActive
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {cat.count}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                  isActive
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-600"
                                } ${isActive ? "" : "rotate-90"}`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <div
            className={`xl:hidden fixed inset-0 z-50 flex transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* Overlay */}
            <div
              className={`fixed inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300 ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <div
              className={`relative w-66 bg-white shadow-xl h-full transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-xl text-gray-900">Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-full overflow-y-auto pb-20">
                <div className="p-4">
                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            setIsSidebarOpen(false);
                          }}
                          className={`group w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                            isActive
                              ? "bg-gradient-to-r border-blue-500 bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isActive
                                    ? "bg-white/20"
                                    : "bg-gray-100 group-hover:bg-gray-200"
                                }`}
                              >
                                <span className="text-lg">{cat.icon}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">
                                  {cat.name}
                                </div>
                                <div
                                  className={`text-xs ${
                                    isActive ? "text-blue-600" : "text-gray-500"
                                  }`}
                                >
                                  {cat.count}
                                </div>
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                isActive
                                  ? "text-blue-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              } ${isActive ? "" : "rotate-90"}`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex-1 xl:pr-10 px-4 xl:px-0">
            {selectedCategory ? (
              /* Product Listing */
              <div>
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.name
                      }
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.count
                      }{" "}
                      •{" "}
                      {
                        categories.find((c) => c.slug === selectedCategory)
                          ?.description
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {fakeProducts[selectedCategory as keyof typeof fakeProducts]
                  ?.length > 0 ? (
                  <div
                    className={`grid gap-4 sm:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {fakeProducts[
                      selectedCategory as keyof typeof fakeProducts
                    ]?.map((product, idx) => (
                      <Card
                        key={idx}
                        className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
                      >
                        <CardContent className="p-6">
                          {product.badge && (
                            <Badge
                              className={`mb-3 ${getBadgeColor(product.badge)}`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                          <div className="text-center mb-4">
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                              {product.image}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                ({product.reviews})
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <span className="text-2xl font-bold text-green-600">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Products in this category have been are currently
                      unavailable or removed.
                    </p>
                    <Button
                      onClick={() => setSelectedCategory(null)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse All Categories
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Category Grid */
              <div>
                <div className="text-left mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Shop by Category
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    Explore our wide range of electronics and tech products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  {categories.map((category) => (
                    <Card
                      key={category.slug}
                      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1"
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      <CardContent className="p-4 sm:p-8 text-center">
                        <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                          <span className="text-2xl sm:text-3xl">
                            {category.icon}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                          {category.description}
                        </p>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium">
                          {category.count}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
                    Why Shop With Us?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">🚚</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Fast Delivery
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Free shipping on orders over $50. Same-day delivery
                        available.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">🛡️</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Secure Shopping
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Your data is protected with industry-standard
                        encryption.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl sm:text-2xl">💎</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Premium Quality
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Only authentic products from trusted brands and
                        manufacturers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
