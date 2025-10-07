import { NextResponse } from 'next/server'
import { pendingUsers } from '../signup/route'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    pendingUsers.delete(email)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
