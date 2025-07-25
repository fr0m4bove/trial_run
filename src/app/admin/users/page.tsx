// /src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'

interface UserData {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: any
  lastLogin: any
}

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[]
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !currentStatus
      })
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: !currentStatus } : user
      ))
      alert('Admin status updated successfully!')
    } catch (error) {
      console.error('Error updating admin status:', error)
      alert('Failed to update admin status')
    }
  }

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <div style={{
          minHeight: '100vh',
          paddingTop: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)'
        }}>
          <p style={{ color: '#f4b41f' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #2c1810 0%, #3a251a 50%, #4a332a 100%)',
        paddingTop: '100px',
        paddingBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <h1 style={{
            fontFamily: 'Crimson Text, serif',
            fontSize: '2.5rem',
            color: '#f4b41f',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            User Management
          </h1>

          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0cec7' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#43302b' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#43302b' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#43302b' }}>Admin</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#43302b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e0cec7' }}>
                    <td style={{ padding: '1rem', color: '#5d4037' }}>{user.email}</td>
                    <td style={{ padding: '1rem', color: '#5d4037' }}>{user.displayName}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: user.isAdmin ? '#4caf50' : '#ff9800',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.75rem'
                      }}>
                        {user.isAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                        style={{
                          background: user.isAdmin ? '#ff9800' : '#4caf50',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                        disabled={user.email === 'noahriordan31@gmail.com'}
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}