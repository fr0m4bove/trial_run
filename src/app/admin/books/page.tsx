// src/app/admin/books/new/page.tsx
'use client'

import { Header } from '@/components/layout/Header'
import { BookUpload } from '@/components/admin/BookUpload'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function NewBookPage() {
  return (
    <ProtectedRoute adminOnly>
      <Header />
      <BookUpload />
    </ProtectedRoute>
  )
}