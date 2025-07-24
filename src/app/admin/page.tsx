// src/app/admin/books/page.tsx - Updated ManageBooks page
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { Book } from '@/types/book'
import { useAuth } from '@/components/auth/AuthProvider'

function ManageBooks() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Query all books, ordered by creation date (newest first)
      const booksQuery = query(
        collection(db, 'books'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(booksQuery)
      const fetchedBooks: Book[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedBooks.push({
          id: doc.id,
          ...data
        } as Book)
      })
      
      setBooks(fetchedBooks)
    } catch (error) {
      console.error('Error fetching books:', error)
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(book.id)
    try {
      // Delete files from storage
      if (book.pdfUrl) {
        const pdfRef = ref(storage, book.pdfUrl)
        await deleteObject(pdfRef).catch(() => {}) // Ignore if file doesn't exist
      }
      
      if (book.coverUrl) {
        const coverRef = ref(storage, book.coverUrl)
        await deleteObject(coverRef).catch(() => {}) // Ignore if file doesn't exist
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'books', book.id))
      
      // Update local state
      setBooks(books.filter(b => b.id !== book.id))
      
      alert('Book deleted successfully!')
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Failed to delete book. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleBookStatus = async (book: Book) => {
    const newStatus = book.status === 'published' ? 'draft' : 'published'
    
    try {
      await updateDoc(doc(db, 'books', book.id), {
        status: newStatus
      })
      
      // Update local state
      setBooks(books.map(b => 
        b.id === book.id ? { ...b, status: newStatus } : b
      ))
      
      alert(`Book ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
    } catch (error) {
      console.error('Error updating book status:', error)
      alert('Failed to update book status. Please try again.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div style={{
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
          <h2>Please log in to manage books</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
        `,
        paddingTop: '100px',
        paddingBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#f4b41f', fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ color: '#f4b41f', fontFamily: 'Crimson Text, serif' }}>Loading your books...</h2>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 15% 30%, rgba(212, 186, 176, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 85% 70%, rgba(151, 118, 105, 0.1) 0%, transparent 50%),
        linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)
      `,
      paddingTop: '100px',
      paddingBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'rgba(253, 248, 246, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(244, 180, 31, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => window.history.back()}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#5d4037'
                }}
              >
                ←
              </button>
              <div>
                <h1 style={{
                  fontFamily: 'Crimson Text, Georgia, serif',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#43302b',
                  margin: 0
                }}>
                  Manage Books
                </h1>
                <p style={{
                  color: '#5d4037',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
                </p>
              </div>
            </div>
            
            <a 
              href="/admin/books/new"
              style={{
                background: '#f4b41f',
                color: '#43302b',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(244, 180, 31, 0.3)'
              }}
            >
              📖 Add New Book
            </a>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '15px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#ff6b35',
            textAlign: 'center'
          }}>
            {error}
            <button 
              onClick={fetchBooks}
              style={{
                marginLeft: '1rem',
                background: '#f4b41f',
                color: '#43302b',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '15px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {books.length === 0 ? (
          /* No Books State */
          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '20px',
            padding: '4rem',
            textAlign: 'center',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📚</div>
            <h2 style={{
              fontFamily: 'Crimson Text, serif',
              fontSize: '1.8rem',
              color: '#43302b',
              marginBottom: '1rem'
            }}>
              No Books Yet
            </h2>
            <p style={{
              color: '#5d4037',
              marginBottom: '2rem',
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              Your library is ready to be filled with amazing stories!<br />
              Upload your first book to get started.
            </p>
            <a href="/admin/books/new" style={{
              display: 'inline-block',
              background: '#f4b41f',
              color: '#43302b',
              padding: '1rem 2rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(244, 180, 31, 0.3)'
            }}>
              📖 Upload Your First Book
            </a>
          </div>
        ) : (
          /* Books List */
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {books.map((book) => (
              <div
                key={book.id}
                style={{
                  background: 'rgba(253, 248, 246, 0.95)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(244, 180, 31, 0.2)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  
                  {/* Book Cover */}
                  <div style={{
                    width: '120px',
                    height: '160px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #8d6e63, #6d4c41)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                  }}>
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `
                            <div style="
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: linear-gradient(135deg, #6d4c41, #5d4037);
                              color: #f4b41f;
                              font-size: 2rem;
                            ">📚</div>
                          `
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6d4c41, #5d4037)',
                        color: '#f4b41f',
                        fontSize: '2rem'
                      }}>
                        📚
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{
                        fontFamily: 'Crimson Text, serif',
                        fontSize: '1.5rem',
                        color: '#43302b',
                        margin: 0,
                        fontWeight: '600'
                      }}>
                        {book.title}
                      </h3>
                      <span style={{
                        background: book.status === 'published' ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {book.status === 'published' ? '🟢 Published' : '🟡 Draft'}
                      </span>
                    </div>
                    
                    {book.description && (
                      <p style={{
                        color: '#5d4037',
                        marginBottom: '1rem',
                        lineHeight: '1.6',
                        fontSize: '0.95rem'
                      }}>
                        {book.description}
                      </p>
                    )}
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      fontSize: '0.85rem',
                      color: '#8d6e63'
                    }}>
                      <div>📄 {formatFileSize(book.fileSize)}</div>
                      <div>📅 {formatDate(book.uploadedAt)}</div>
                      <div>📁 {book.fileName}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minWidth: '140px'
                  }}>
                    <button
                      onClick={() => window.open(book.pdfUrl, '_blank')}
                      style={{
                        background: '#f4b41f',
                        color: '#43302b',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      📖 View PDF
                    </button>
                    
                    <button
                      onClick={() => toggleBookStatus(book)}
                      style={{
                        background: book.status === 'published' ? '#ff9800' : '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {book.status === 'published' ? '📝 Unpublish' : '🚀 Publish'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteBook(book)}
                      disabled={deletingId === book.id}
                      style={{
                        background: deletingId === book.id ? '#bfa094' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '15px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: deletingId === book.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {deletingId === book.id ? '⏳ Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ManageBooksPage() {
  return (
    <div>
      <Header />
      <ManageBooks />
    </div>
  )
}