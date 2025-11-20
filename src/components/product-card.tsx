"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, X, Heart, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { Button } from "./ui/button";

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  coverImage?: string;
  frontImage?: string;
  image?: string;
  price: number;
  mrp?: number;
  quantity?: number;
  stock?: number;
  color?: string;
  rating?: number;
  ratingCount?: number;
  ramOptions?: { size: string; price: number; quantity: number }[];
  storageOptions?: { size: string; price: number; quantity: number }[];
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (e: React.MouseEvent, product: any) => void;
  onBuyNow?: (e: React.MouseEvent, product: any) => void;
};

export default function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [isWished, setIsWished] = useState(false);
  const [availableQty, setAvailableQty] = useState(0);

  useEffect(() => {
    setIsWished(isInWishlist(product.id));
    const onUpdate = () => setIsWished(isInWishlist(product.id));
    window.addEventListener('wishlist-updated', onUpdate);
    return () => window.removeEventListener('wishlist-updated', onUpdate);
  }, [product.id]);

  useEffect(() => {
    if (product.ramOptions && product.ramOptions.length > 0) {
      const totalQty = product.ramOptions.reduce((sum, opt) => sum + (opt.quantity || 0), 0);
      setAvailableQty(totalQty);
    } else {
      setAvailableQty(Number(product.quantity ?? product.stock ?? 0));
    }
  }, [product.quantity, product.stock, product.ramOptions]);

  const imageUrl = product.coverImage || product.frontImage || product.image || "/placeholder.svg";
  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  const discountPct = mrp > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/products/${shareProduct?.slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success("Link copied!"))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (url: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success("Link copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
    document.body.removeChild(textArea);
  };

  return (
    <>
      {/* card: full height, flex column */}
      <div className="bg-gray-50 border sm:rounded-sm transition-shadow duration-200 flex flex-col h-full relative overflow-hidden">
        {/* image + badges */}
        <Link href={`/products/${product.slug}`} className="block flex-shrink-0">
          {discountPct > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
              {discountPct}% OFF
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const added = toggleWishlist({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: imageUrl,
                description: product.description || 'High-quality product with premium features',
              });
              toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* FIX: fixed height for image block so all cards match */}
          <div className="relative h-56 sm:h-64 bg-white p-4 flex items-center justify-center overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="object-contain max-w-full max-h-full"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />

            {availableQty === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 font-bold text-sm">OUT OF STOCK</span>
              </div>
            )}
          </div>
        </Link>

        {/* content -> flex-1 so cards match height and CTA stays at bottom */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2 h-10">
              <Link href={`/products/${product.slug}`} className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 leading-snug">
                  {product.name}
                </h3>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShareProduct(product);
                }}
                className="ml-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="Share product"
                aria-label="Share product"
              >
                <Share2 className="h-4 w-4 text-gray-600"/>
              </button>
            </div>

            <Link href={`/products/${product.slug}`}>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-1 h-8 sm:h-10">
                {product.description || 'High-quality product with premium features'}
              </p>
            </Link>

            {(product.rating && product.rating > 0) && (
              <Link href={`/products/${product.slug}`}>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= (product.rating || 0) ? 'text-green-500' : 'text-gray-300'}`}>★</span>
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({product.ratingCount || 0})</span>
                </div>
              </Link>
            )}

            <Link href={`/products/${product.slug}`}>
              <div className="mb-2">
                <div className="grid grid-cols-1 items-baseline sm:gap-2 sm:mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{price.toLocaleString()}
                  </span>
                  {mrp > 0 && mrp > price && (
                    <span className="space-x-2">
                      <span className="text-sm text-gray-400 line-through">
                        ₹{mrp.toLocaleString()}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        {discountPct}% off
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* bottom CTA area — stays at bottom because parent is justify-between */}
          <div className="">
            {onAddToCart && onBuyNow ? (
              <>
                {availableQty === 0 ? (
                  <div className="text-sm font-semibold text-red-600">Out of Stock</div>
                ) : (
                  <Link href={`/products/${product.slug}`} className="inline-flex items-center font-semibold text-sm text-orange-600">
                    <span>Buy now</span>
                    <ChevronRight className="h-4 ml-1"/>
                  </Link>
                )}
                {/* hidden old buttons left as-is but visually hidden (or you can enable) */}
                <div className="hidden gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      const defaultColor = product.color ? product.color.split(',')[0].trim() : undefined;
                      onAddToCart(e, { ...product, selectedColor: defaultColor });
                    }}
                    disabled={availableQty === 0}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 text-[10px] lg:text-[12px] xl:text-sm transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={(e) => {
                      const defaultColor = product.color ? product.color.split(',')[0].trim() : undefined;
                      onBuyNow(e, { ...product, selectedColor: defaultColor });
                    }}
                    disabled={availableQty === 0}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 text-[10px] lg:text-[12px] xl:text-sm transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                  >
                    BUY NOW
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Share Popup (unchanged) */}
      {shareProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShareProduct(null)}>
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Product</h3>
              <button onClick={() => setShareProduct(null)} className="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {/* buttons unchanged — keep your existing share buttons here */}
              {/* ... (same as your original share buttons) */}
            </div>

            <div className="flex gap-1 pt-3 border-t overflow-scroll">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/products/${shareProduct.slug}`}
                className="flex-1 px-3 py-2 border rounded text-sm bg-gray-50"
              />

              <Button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 p-3 px-5 hover:bg-purple-700 hover:cursor-pointer rounded transition-colors bg-purple-600"
              >
                <span className="text-xs font-medium">Copy </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
