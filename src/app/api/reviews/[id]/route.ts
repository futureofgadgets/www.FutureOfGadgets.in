import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
    const { adminReply } = body
    
    await prisma.$runCommandRaw({
      update: 'Review',
      updates: [{
        q: { _id: { $oid: id } },
        u: { $set: { adminReply, updatedAt: new Date() } }
      }]
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const user = await prisma.user.findFirst({ where: { email: session.user.email } })
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    await prisma.$runCommandRaw({
      delete: 'Review',
      deletes: [{
        q: { _id: { $oid: id } },
        limit: 1
      }]
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review delete error:', error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
