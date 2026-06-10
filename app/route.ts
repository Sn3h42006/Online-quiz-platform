// Stub auth handler - Better Auth will be configured properly in production
export async function GET() {
  return new Response('Auth endpoint', { status: 200 })
}

export async function POST() {
  return new Response('Auth endpoint', { status: 200 })
}
