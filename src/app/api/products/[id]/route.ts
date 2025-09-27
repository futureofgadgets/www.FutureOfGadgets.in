import { NextResponse } from "next/server";
import { products } from "@/lib/data/products";

// GET single product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// Update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
  return NextResponse.json(products[index]);
}

// Delete product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const deleted = products.splice(index, 1)[0];
  return NextResponse.json({ success: true, deleted });
}
