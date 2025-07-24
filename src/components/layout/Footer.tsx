// src/components/layout/Footer.tsx
'use client'

import { BookOpen, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-dark-academia-50 border-t border-dark-academia-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-dark-academia-600" />
            <span className="text-lg font-serif font-semibold text-dark-academia-900">
              Book Sanctuary
            </span>
          </div>
          
          <p className="text-dark-academia-700 text-sm flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for the love of literature</span>
          </p>
          
          <div className="mt-4 text-xs text-dark-academia-600">
            <p>&copy; {new Date().getFullYear()} Book Sanctuary. A place where stories come alive.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ---