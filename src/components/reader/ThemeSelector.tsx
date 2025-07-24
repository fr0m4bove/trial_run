'use client'

import { Theme } from './PDFReader'

interface ThemeSelectorProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  onClose: () => void
}

export function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  const themes = [
    {
      id: 'cozy-cabin' as Theme,
      name: 'Cozy Cabin',
      description: 'Warm fireplace with gentle snowfall',
      emoji: '🏔️',
      preview: 'linear-gradient(135deg, #87CEEB 0%, #DEB887 50%, #8B4513 100%)'
    },
    {
      id: 'midnight-library' as Theme,
      name: 'Midnight Library',
      description: 'Dark academia with candlelight',
      emoji: '🌙',
      preview: 'linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #0f0f23 100%)'
    },
    {
      id: 'rainy-day' as Theme,
      name: 'Rainy Day',
      description: 'Cozy indoors with rain on windows',
      emoji: '☔',
      preview: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)'
    }
  ]

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      zIndex: 20,
      minWidth: '300px'
    }}>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontFamily: 'Crimson Text, serif',
          fontSize: '1.5rem',
          color: '#f4b41f',
          margin: 0
        }}>
          Reading Themes
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%'
          }}
        >
          ×
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              onThemeChange(theme.id)
              onClose()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: currentTheme === theme.id 
                ? 'rgba(244, 180, 31, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: currentTheme === theme.id 
                ? '2px solid rgba(244, 180, 31, 0.5)' 
                : '2px solid transparent',
              borderRadius: '15px',
              padding: '1rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '60px',
              height: '40px',
              borderRadius: '8px',
              background: theme.preview,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              {theme.emoji}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Crimson Text, serif',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: currentTheme === theme.id ? '#f4b41f' : 'white',
                marginBottom: '0.25rem'
              }}>
                {theme.name}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.3'
              }}>
                {theme.description}
              </div>
            </div>

            {currentTheme === theme.id && (
              <div style={{
                color: '#f4b41f',
                fontSize: '1.2rem'
              }}>
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}