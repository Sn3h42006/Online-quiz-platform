'use client'

// Mock auth client for demo
export const authClient = {
  signIn: {
    email: async () => ({ success: true }),
  },
  signUp: {
    email: async () => ({ success: true }),
  },
  signOut: async () => ({ success: true }),
  useSession: () => ({
    data: {
      user: {
        id: 'demo-user-1',
        email: 'demo@example.com',
        name: 'Demo User',
      },
    },
    isPending: false,
  }),
}

export const signIn = authClient.signIn.email
export const signUp = authClient.signUp.email
export const signOut = authClient.signOut
export const useSession = authClient.useSession
