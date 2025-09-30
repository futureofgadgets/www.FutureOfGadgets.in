import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { billData, fileName, fileType } = await request.json()
    
    if (!billData) {
      return NextResponse.json({ error: "No bill data provided" }, { status: 400 })
    }
    
    // Check if order exists first
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        billUrl: billData,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({ order: updatedOrder, success: true })
  } catch (error) {
    console.error('Error uploading bill:', error)
    return NextResponse.json({ 
      error: "Failed to upload bill", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}