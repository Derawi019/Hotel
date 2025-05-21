import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { validateUser } from '@/lib/auth'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import prisma from '@/lib/prisma'

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        }
    }
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password')
                }

                const user = await validateUser(credentials.email, credentials.password)

                if (user) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                }

                return null
            }
        })
    ],
    session: {
        strategy: 'jwt' as const
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                })

                if (!existingUser) {
                    // Create new user if doesn't exist
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name,
                            image: user.image,
                            password: '', // Empty password for OAuth users
                        }
                    })
                }
            }
            return true
        },
        async jwt({ token, user }: { token: JWT; user: any }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 