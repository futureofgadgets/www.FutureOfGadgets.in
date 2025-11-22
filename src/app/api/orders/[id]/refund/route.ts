import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { transactionId } = await req.json()
    if (!transactionId?.trim()) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const orderData = await prisma.$runCommandRaw({
      find: 'Order',
      filter: { _id: { $oid: orderId } },
      limit: 1
    })

    const orders = (orderData as any).cursor.firstBatch
    if (!orders.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]
    if (order.status !== 'delivered' && order.status !== 'cancelled') {
      return NextResponse.json({ error: 'Only delivered or cancelled orders can be refunded' }, { status: 400 })
    }

    if (order.status === 'cancelled' && order.paymentMethod === 'cod') {
      return NextResponse.json({ error: 'Cancelled COD orders cannot be refunded' }, { status: 400 })
    }

    await prisma.$runCommandRaw({
      update: 'Order',
      updates: [{
        q: { _id: { $oid: orderId } },
        u: { 
          $set: { 
            refundTransactionId: transactionId.trim(),
            updatedAt: { $date: new Date().toISOString() }
          } 
        }
      }]
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}
