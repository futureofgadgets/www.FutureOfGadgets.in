import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const user = await prisma.user.findFirst({ where: { email: session.user.email } })
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    const body = await request.json()
    const { productId, rating, comment, userName } = body
    
    const review = await prisma.$runCommandRaw({
      insert: 'Review',
      documents: [{
        productId,
        userId: user.email,
        userName: userName || "Admin",
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    })
    
    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Admin review error:', error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
