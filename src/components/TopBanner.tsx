"use client";
import Link from "next/link";
import React from "react";
import { X, Package } from "lucide-react";

export default function TopBanner({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md"
      role="region"
      aria-label="Top announcement"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <p className="text-xs sm:text-sm md:text-base font-medium text-white truncate">
            We also accept bulk orders — Contact us for wholesale pricing
          </p>

          <div>
            <Link
              href="/contact"
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-blue-700 rounded text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            aria-label="Close banner"
            className="p-1 sm:p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 hover:cursor-pointer"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
