// src/components/books/BookCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Book } from '@/types/book'
import { Clock, BookOpen } from 'lucide-react'
import { estimateReadingTime } from '@/lib/utils'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const totalWords = book.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0)
  const readingTime = estimateReadingTime(totalWords)

  return (
    <Link href={`/book/${book.id}`} className="book-card group block">
      <div className="book-cover relative overflow-hidden bg-gradient-to-br from-dark-academia-100 to-dark-academia-200">
        {!imageError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-dark-academia-400" />
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-dark-academia-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg"
          >
            <BookOpen className="w-6 h-6 text-dark-academia-700" />
          </motion.div>
        </div>

        {/* Reading Stats */}
        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white text-xs rounded px-2 py-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{readingTime} min read</span>
          </div>
          <span>{book.totalChapters} chapters</span>
        </div>
      </div>

      <div className="book-title">
        {book.title}
      </div>
      
      {book.description && (
        <p className="text-sm text-dark-academia-600 text-center mt-2 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      )}
    </Link>
  )
}

// ---