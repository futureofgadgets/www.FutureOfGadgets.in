import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ObjectId } from 'mongodb'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: orderId } = await context.params

  try {
    const user = await prisma.user.findFirst({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { reason } = await req.json()

    // Use raw MongoDB to bypass Prisma DateTime parsing
    const orderData = await prisma.$runCommandRaw({
      find: 'Order',
      filter: { _id: { $oid: orderId } },
      limit: 1
    })

    const orders = (orderData as any).cursor.firstBatch
    if (!orders.length || orders[0].userId.$oid !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // Update using raw MongoDB
    await prisma.$runCommandRaw({
      update: 'Order',
      updates: [{
        q: { _id: { $oid: orderId } },
        u: { 
          $set: { 
            status: 'cancelled', 
            cancelReason: reason || null,
            updatedAt: { $date: new Date().toISOString() }
          } 
        }
      }]
    })

    // Restock items
    const items = order.items || []
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (product) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.qty },
            stock: { increment: item.qty }
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }
}
