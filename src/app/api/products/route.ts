import { NextResponse } from "next/server";
import { products } from "@/lib/data/products";

// GET all products
export async function GET() {
  return NextResponse.json(products);
}

// POST new product
export async function POST(req: Request) {
  const data = await req.json();
  const newProduct = { ...data, id: Date.now().toString(), updatedAt: new Date().toISOString() };
  products.push(newProduct);
  return NextResponse.json(newProduct);
}
