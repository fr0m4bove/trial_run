// src/components/books/BookGallery.tsx - Updated to use custom PDF reader
'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Book } from '@/types/book'
import { PDFReader } from '../reader/PDFReader'

export function BookGallery() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get all books from Firestore
      const booksQuery = query(
        collection(db, 'books'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(booksQuery)
      const fetchedBooks: Book[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        // Create book object with proper defaults
        const book: Book = {
          id: doc.id,
          title: data.title || 'Untitled',
          description: data.description || '',
          pdfUrl: data.pdfUrl || '',
          coverUrl: data.coverUrl || '',
          uploadedBy: data.uploadedBy || data.authorId || '',
          uploadedAt: data.uploadedAt || data.createdAt,
          status: data.status || (data.isPublished ? 'published' : 'draft'),
          fileSize: data.fileSize || data.metadata?.fileSize || 0,
          fileName: data.fileName || data.metadata?.originalFileName || 'Unknown',
          isPublished: data.isPublished !== false,
          authorId: data.authorId || data.uploadedBy || '',
          chapters: data.chapters || [],
          totalChapters: data.totalChapters || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          metadata: data.metadata || {
            originalFileName: data.fileName || 'Unknown',
            fileSize: data.fileSize || 0,
            processingStatus: 'completed' as const
          }
        }
        
        fetchedBooks.push(book)
      })
      
      // Filter for published books only
      const publishedBooks = fetchedBooks.filter(book => 
        book.status === 'published' || book.isPublished === true
      )
      
      setBooks(publishedBooks)
      
    } catch (error: any) {
      console.error('Error fetching books:', error)
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (e) {
      return 'Invalid Date'
    }
  }

  if (loading) {
    return (
      <section style={{
        padding: '6rem 2rem 4rem',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#f4b41f' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontFamily: 'Crimson Text, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Loading your library...
          </h2>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(244, 180, 31, 0.3)',
            borderTop: '3px solid #f4b41f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section style={{
        padding: '6rem 2rem 4rem',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#f4b41f' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'Crimson Text, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Unable to Load Library
          </h2>
          <p style={{ color: '#ff6b6b', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={fetchBooks}
            style={{
              background: '#f4b41f',
              color: '#43302b',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section style={{
        padding: '6rem 2rem 4rem',
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
        `
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📚</div>
          <h2 style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#f4b41f',
            marginBottom: '1rem'
          }}>
            No Books Yet
          </h2>
          <p style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '1.2rem',
            color: '#d2bab0',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Your literary sanctuary awaits its first stories. Upload your first book to begin building your collection.
          </p>
          <a
            href="/admin/books/new"
            style={{
              display: 'inline-block',
              background: '#f4b41f',
              color: '#43302b',
              padding: '1rem 2rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(244, 180, 31, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            📖 Upload Your First Book
          </a>
        </div>
      </section>
    )
  }

  return (
    <section style={{
      padding: '6rem 2rem 4rem',
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
        linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
      `
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
          
          <h2 style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '700',
            color: '#f4b41f',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em'
          }}>
            Literary Collection
          </h2>
          
          <div style={{
            width: '150px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #f4b41f, transparent)',
            margin: '1.5rem auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              background: '#f4b41f',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(244, 180, 31, 0.8)'
            }}></div>
          </div>
          
          <p style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '1.2rem',
            color: '#d2bab0',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            {books.length} {books.length === 1 ? 'story' : 'stories'} waiting to transport you to new worlds
          </p>
        </div>

        {/* Books Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '3rem',
          justifyItems: 'center'
        }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) rotateY(-8deg) scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) rotateY(0) scale(1)'
              }}
              onClick={() => setSelectedBook(book)}
            >
              {/* Book Cover */}
              <div style={{
                width: '180px',
                height: '270px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: `
                  0 10px 30px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(244, 180, 31, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                position: 'relative',
                background: 'linear-gradient(135deg, #8d6e63, #6d4c41)',
                marginBottom: '1.5rem'
              }}>
                
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.innerHTML = `
                          <div style="
                            width: 100%; height: 100%;
                            display: flex; align-items: center; justify-content: center;
                            background: linear-gradient(135deg, #6d4c41, #5d4037);
                            color: #f4b41f; font-size: 1.2rem; text-align: center; padding: 1rem;
                            font-family: Crimson Text, serif; font-weight: 600;
                          ">📚<br/>${book.title}</div>
                        `
                      }
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #6d4c41, #5d4037)',
                    color: '#f4b41f', fontSize: '1.2rem', textAlign: 'center', padding: '1rem',
                    fontFamily: 'Crimson Text, serif', fontWeight: '600'
                  }}>
                    📚<br/>{book.title}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(244, 180, 31, 0.15)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    background: 'rgba(253, 248, 246, 0.95)',
                    borderRadius: '50%',
                    width: '50px', height: '50px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}>
                    📖
                  </div>
                </div>

                {/* Book Info Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px', left: '8px', right: '8px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}>
                  <div>📄 {formatFileSize(book.fileSize)}</div>
                  <div>📅 {formatDate(book.uploadedAt)}</div>
                </div>
              </div>

              {/* Book Title & Description */}
              <div style={{ textAlign: 'center', maxWidth: '180px' }}>
                <h3 style={{
                  fontFamily: 'Crimson Text, Georgia, serif',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#f4b41f',
                  marginBottom: '0.5rem',
                  lineHeight: '1.3',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {book.title}
                </h3>
                
                {book.description && (
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.85rem',
                    color: '#bfa094',
                    lineHeight: '1.4',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {book.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(244, 180, 31, 0.2)'
        }}>
          <div style={{
            fontFamily: 'Crimson Text, Georgia, serif',
            fontSize: '0.95rem',
            color: 'rgba(212, 186, 176, 0.7)',
            fontStyle: 'italic'
          }}>
            "Books are a uniquely portable magic." — Stephen King
          </div>
        </div>
      </div>

      {/* Custom PDF Reader */}
      {selectedBook && (
        <PDFReader
          pdfUrl={`/api/pdf-proxy?url=${encodeURIComponent(selectedBook.pdfUrl)}`}
          bookTitle={selectedBook.title}
          onClose={() => setSelectedBook(null)}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}