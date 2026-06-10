// Simplified auth for demo purposes
// In production, use Better Auth properly configured

export async function getSessionUser() {
  // Return a demo user for now
  return {
    id: 'demo-user-1',
    email: 'demo@example.com',
    name: 'Demo User',
  }
}
