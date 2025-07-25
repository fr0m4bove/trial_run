// src/app/auth/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new login page
    router.push('/login')
  }, [router])
  
  return null
}