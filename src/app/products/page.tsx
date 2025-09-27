"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  description: string;
  coverImage: string;
  images: string[];
  price: number;
  quantity: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="space-y-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`} // <-- Use ID here
            className="block border rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={product.coverImage || "/placeholder.svg"}
                alt={product.name}
                className="w-full md:w-48 h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-sm text-muted-foreground">{product.type}</p>
                  <p className="text-sm mt-2 line-clamp-3">{product.description}</p>
                </div>
                <p className="mt-2 font-medium">₹{product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
