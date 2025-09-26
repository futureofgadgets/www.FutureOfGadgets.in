import { NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/data/products"

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProductBySlug(slug)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(p, { status: 200, headers: { "Cache-Control": "no-store" } })
}
