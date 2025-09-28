import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
        isSignUp: { label: 'IsSignUp', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Default admin for development
        if (credentials.email === 'admin@electronic.com') {
          let admin = await prisma.user.findUnique({ where: { email: 'admin@electronic.com' } })
          if (!admin) {
            admin = await prisma.user.create({
              data: {
                email: 'admin@electronic.com',
                name: 'Sonu',
                phone: '9905757864',
                role: 'admin',
                password: await bcrypt.hash(credentials.password, 12)
              }
            })
          } else {
            // Update existing user to admin if not already
            if (admin.role !== 'admin') {
              admin = await prisma.user.update({
                where: { email: 'admin@electronic.com' },
                data: { role: 'admin', name: 'Sonu', phone: '9905757864' }
              })
            }
          }
          
          if (admin.password && await bcrypt.compare(credentials.password, admin.password)) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role
            }
          }
          return null
        }
        
        // Check existing user
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        
        // If signing up, create new user
        if (credentials.isSignUp === 'true') {
          if (user) {
            return null // Will be handled as error in callback
          }
          try {
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.name || credentials.email.split('@')[0],
                phone: credentials.phone || null,
                password: await bcrypt.hash(credentials.password, 12),
                role: 'user'
              }
            })
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role
            }
          } catch (error) {
            return null
          }
        }
        
        // If signing in, check user exists and password matches
        if (!user) {
          return null // Will be handled as error in callback
        }
        
        if (!user.password || !await bcrypt.compare(credentials.password, user.password)) {
          return null // Will be handled as error in callback
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || (user.email === 'admin@electronic.com' ? 'admin' : 'user')
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as string
      session.user.id = token.id as string
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email! } })
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              phone: user.email === 'admin@electronic.com' ? '9905757864' : null,
              role: user.email === 'admin@electronic.com' ? 'admin' : 'user'
            }
          })
        } else if (user.email === 'admin@electronic.com' && existingUser.role !== 'admin') {
          // Update to admin if signing in with Google
          await prisma.user.update({
            where: { email: 'admin@electronic.com' },
            data: { role: 'admin', name: 'Sonu', phone: '9905757864' }
          })
        }
      }
      return true
    }
  }
}