// src/app/admin/books/new/page.tsx - Create this file
'use client'

import { Header } from '@/components/layout/Header'
import { BookUpload } from '@/components/admin/BookUpload'

export default function NewBookPage() {
  return (
    <div>
      <Header />
      <BookUpload />
    </div>
  )
}

// ---