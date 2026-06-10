import { redirect } from 'next/navigation'

export default async function Page() {
  // Redirect to dashboard for now
  redirect('/dashboard')
}
