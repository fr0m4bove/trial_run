// src/components/admin/ManageBooks.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function ManageBooks() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading books
    setTimeout(() => {
      setBooks([]) // No books yet
      setLoading(false)
    }, 1000)
  }, [])

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
                Edit, organize, and manage your literary collection
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '20px',
            padding: '4rem',
            textAlign: 'center',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f4b41f',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#5d4037' }}>Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
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
          // Will show books here when they exist
          <div>
            {/* Books grid will go here */}
          </div>
        )}
      </div>
    </div>
  )
}