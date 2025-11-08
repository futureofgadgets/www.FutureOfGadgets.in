import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    const categories = products.map(p => p.category).filter(Boolean);
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ categories: [] });
  }
}