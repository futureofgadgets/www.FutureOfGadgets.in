import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const orderId = searchParams.get("orderId")
  
  try {
    const filter: any = {}
    if (productId) filter.productId = productId
    if (orderId) filter.orderId = orderId
    
    const result = await prisma.$runCommandRaw({
      find: 'Review',
      filter,
      sort: { createdAt: -1 }
    })
    
    const reviews = (result as any).cursor.firstBatch.map((r: any) => ({
      id: r._id.$oid,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      adminReply: r.adminReply,
      createdAt: r.createdAt.$date || r.createdAt,
      updatedAt: r.updatedAt.$date || r.updatedAt
    }))
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json({ reviews: [] })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { orderId, productId, rating, comment } = body
    
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || (order.status !== "delivered" && order.status !== "shipped")) {
      return NextResponse.json({ error: "Order not eligible for review" }, { status: 400 })
    }
    
    const deliveredDate = new Date(order.updatedAt)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    if (deliveredDate < threeDaysAgo) {
      return NextResponse.json({ error: "Review period expired" }, { status: 400 })
    }
    
    const existingResult = await prisma.$runCommandRaw({
      find: 'Review',
      filter: { orderId, productId },
      limit: 1
    })
    if ((existingResult as any).cursor.firstBatch.length > 0) {
      return NextResponse.json({ error: "Review already submitted" }, { status: 400 })
    }
    
    await prisma.$runCommandRaw({
      insert: 'Review',
      documents: [{
        orderId,
        productId,
        userId: session.user.email,
        userName: session.user.name || "Anonymous",
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    })
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
