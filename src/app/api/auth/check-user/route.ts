import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    const user = await prisma.user.findFirst({
      where: {
        email,
        provider: 'credentials'
      }
    })
    
    return NextResponse.json({ exists: !!user })
  } catch (error) {
    return NextResponse.json({ exists: false })
  }
}
