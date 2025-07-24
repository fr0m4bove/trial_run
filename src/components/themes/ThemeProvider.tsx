// src/components/themes/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from 'C:\\Users/noahr/Desktop/book-sanctuary/src/components/auth/AuthProvider'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'C:\\Users/noahr/Desktop/book-sanctuary/src/lib/firebase'

type Theme = 'dark-academia' | 'pink-floral' | 'minimalist' | 'cozy-library'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [theme, setThemeState] = useState<Theme>('dark-academia')

  useEffect(() => {
    if (user) {
      setThemeState(user.preferences.theme)
    }
  }, [user])

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'preferences.theme': newTheme,
        })
      } catch (error) {
        console.error('Failed to update theme preference:', error)
      }
    }
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}