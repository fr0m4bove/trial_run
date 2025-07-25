// src/components/admin/AdminDashboard.tsx - Updated with smaller cards (20% smaller)
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export function AdminDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 1, // At least the admin user
    recentActivity: []
  })

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
        
        {/* Welcome Header */}
        <div style={{
          background: 'rgba(253, 248, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(244, 180, 31, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>👑</div>
            <div>
              <h1 style={{
                fontFamily: 'Crimson Text, Georgia, serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#43302b',
                margin: 0
              }}>
                Admin Dashboard
              </h1>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: '#5d4037',
                margin: 0
              }}>
                Welcome back, {currentUser?.displayName}! Manage your literary sanctuary.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Made smaller */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>📚</div>
              <div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  color: '#43302b',
                  margin: 0
                }}>
                  {stats.totalBooks}
                </h3>
                <p style={{
                  color: '#5d4037',
                  margin: 0,
                  fontSize: '0.85rem'
                }}>
                  Published Books
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>👥</div>
              <div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  color: '#43302b',
                  margin: 0
                }}>
                  {stats.totalUsers}
                </h3>
                <p style={{
                  color: '#5d4037',
                  margin: 0,
                  fontSize: '0.85rem'
                }}>
                  Registered Readers
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>📈</div>
              <div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  color: '#43302b',
                  margin: 0
                }}>
                  Active
                </h3>
                <p style={{
                  color: '#5d4037',
                  margin: 0,
                  fontSize: '0.85rem'
                }}>
                  Library Status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards - Made 20% smaller */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          
          {/* Add New Book */}
          <Link href="/admin/books/new" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>➕</div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#43302b',
                  marginBottom: '0.75rem'
                }}>
                  Add New Book
                </h3>
                <p style={{
                  color: '#5d4037',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  fontSize: '0.9rem'
                }}>
                  Upload a new book to your library. Support for PDF files with automatic chapter detection.
                </p>
                <div style={{
                  background: '#f4b41f',
                  color: '#43302b',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-block'
                }}>
                  Upload Book
                </div>
              </div>
            </div>
          </Link>

          {/* Manage Books */}
          <Link href="/admin/books" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📝</div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#43302b',
                  marginBottom: '0.75rem'
                }}>
                  Manage Books
                </h3>
                <p style={{
                  color: '#5d4037',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  fontSize: '0.9rem'
                }}>
                  Edit existing books, update descriptions, manage covers, and organize your collection.
                </p>
                <div style={{
                  background: '#8d6e63',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-block'
                }}>
                  View Books
                </div>
              </div>
            </div>
          </Link>

          {/* User Management */}
          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#43302b',
                  marginBottom: '0.75rem'
                }}>
                  User Management
                </h3>
                <p style={{
                  color: '#5d4037',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  fontSize: '0.9rem'
                }}>
                  View registered readers, manage permissions, and monitor reading activity.
                </p>
                <div style={{
                  background: '#6d4c41',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-block'
                }}>
                  View Users
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
                <h3 style={{
                  fontFamily: 'Crimson Text, serif',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#43302b',
                  marginBottom: '0.75rem'
                }}>
                  Reading Analytics
                </h3>
                <p style={{
                  color: '#5d4037',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  fontSize: '0.9rem'
                }}>
                  View reading statistics, popular books, and engagement metrics for your library.
                </p>
                <div style={{
                  background: '#5d4037',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-block'
                }}>
                  View Analytics
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Quote */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(244, 180, 31, 0.2)'
        }}>
          <p style={{
            fontFamily: 'Crimson Text, serif',
            fontSize: '1rem',
            color: 'rgba(212, 186, 176, 0.8)',
            fontStyle: 'italic'
          }}>
            "The library is not a shrine for the worship of books. It is not a temple where literary incense burns. It is a workshop." — Norman Cousins
          </p>
        </div>
      </div>
    </div>
  )
}