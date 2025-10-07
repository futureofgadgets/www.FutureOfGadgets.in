import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pendingUsers } from '../signup/route'

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json()

    const pendingUser = pendingUsers.get(email)
    if (!pendingUser) {
      return NextResponse.json({ error: 'Verification session expired. Please sign up again.' }, { status: 404 })
    }

    if (pendingUser.code !== code) {
      return NextResponse.json({ error: 'Verificaton code invalid' }, { status: 400 })
    }

    if (pendingUser.expires < new Date()) {
      pendingUsers.delete(email)
      return NextResponse.json({ error: 'Code expired. Please sign up again.' }, { status: 400 })
    }

    const newUser = await prisma.user.create({
      data: {
        email: pendingUser.email,
        name: pendingUser.name,
        phone: pendingUser.phone,
        password: pendingUser.password,
        role: 'user',
        provider: 'credentials',
        emailVerified: true
      }
    })

    pendingUsers.delete(email)
    console.log('✅ User created and verified:', newUser.email)

    return NextResponse.json({ success: true, user: { email: newUser.email, name: newUser.name } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
