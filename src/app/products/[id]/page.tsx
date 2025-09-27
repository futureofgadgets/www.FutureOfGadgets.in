"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  name: string;
  title: string;
  sku: string;
  description: string;
  price: number;
  mrp: number;
  quantity: number;
  stock: number;
  status: string;
  category: string;
  brand: string;
  rating: number;
  image: string;
  updatedAt: string;
};

export default function ProductPage() {
  const { id } = useParams(); // ✅ get id

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`) // ✅ fetch by ID
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading product...</p>;
  if (!product) return <p className="p-4">Product not found.</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 h-96 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="mt-2 text-gray-700">{product.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <p className="text-xl font-semibold">₹{product.price.toFixed(2)}</p>
            <p className="text-sm line-through text-gray-400">
              ₹{product.mrp.toFixed(2)}
            </p>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
              OFF
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Stock: {product.stock} / {product.quantity}
          </p>
          <p className="mt-1 text-sm text-yellow-600">Rating: {product.rating} ⭐</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Add to Cart
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
