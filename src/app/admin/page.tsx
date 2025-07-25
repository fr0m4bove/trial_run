// src/app/admin/page.tsx
'use client'

import { Header } from '@/components/layout/Header'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <Header />
      <AdminDashboard />
    </ProtectedRoute>
  )
}