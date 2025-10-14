"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, Heart, User, ShoppingCart, Shield, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const items = getCart();
      setCount(items.reduce((n, i) => n + (i.qty || 1), 0));
    };

    const updateWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    updateCart();
    updateWishlist();

    window.addEventListener("storage", updateCart);
    window.addEventListener("v0-cart-updated", updateCart as EventListener);
    window.addEventListener("storage", updateWishlist);
    window.addEventListener("wishlist-updated", updateWishlist as EventListener);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("v0-cart-updated", updateCart as EventListener);
      window.removeEventListener("storage", updateWishlist);
      window.removeEventListener("wishlist-updated", updateWishlist as EventListener);
    };
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 md:hidden shadow-lg">
      <div className={`flex justify-around items-center px-2 py-0.5 h-15 ${isAdmin ? 'px-1' : ''}`}>
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0 px-4 py-2 rounded-xl transition-all ${
            pathname === "/" 
              ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={pathname === "/" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center gap-0 px-4 py-2 rounded-xl transition-all ${
            pathname === "/wishlist"
              ? "text-pink-600 bg-pink-50 dark:bg-pink-900/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              pathname === "/wishlist" ? "fill-pink-600" : ""
            }`}
            strokeWidth={pathname === "/wishlist" ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center gap-0 px-4 py-2 rounded-xl transition-all ${
            pathname === "/cart" 
              ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <ShoppingCart className="w-5 h-5" strokeWidth={pathname === "/cart" ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Cart</span>
          {count > 0 && (
            <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Link>

        {/* Admin - Only show for admin users */}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center gap-0 px-4 py-2 rounded-xl transition-all ${
              pathname.startsWith("/admin") 
                ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Settings className="w-5 h-5" strokeWidth={pathname.startsWith("/admin") ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-0 px-4 py-2 rounded-xl transition-all ${
            pathname === "/profile" 
              ? "text-green-600 bg-green-50 dark:bg-green-900/20" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {session?.user ? (
            <div className="relative">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                  <span className="text-[10px] font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <User className="w-6 h-6" strokeWidth={pathname === "/profile" ? 2.5 : 2} />
          )}
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
