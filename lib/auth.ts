// Mock auth for demo purposes
export const auth = {
  api: {
    getSession: async () => ({
      user: {
        id: 'demo-user-1',
        email: 'demo@example.com',
        name: 'Demo User',
      },
    }),
  },
}
