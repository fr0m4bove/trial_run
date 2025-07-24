'use client'

import { useState } from 'react'

interface ReaderControlsProps {
  currentPage: number
  totalPages: number
  onPrevPage: () => void
  onNextPage: () => void
  onGoToPage: (page: number) => void
}

export function ReaderControls({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage
}: ReaderControlsProps) {
  const [pageInput, setPageInput] = useState('')
  const [showPageInput, setShowPageInput] = useState(false)

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(pageInput)
    if (page >= 1 && page <= totalPages) {
      onGoToPage(page)
      setShowPageInput(false)
      setPageInput('')
    }
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '25px',
      padding: '1rem 2rem',
      zIndex: 10
    }}>
      
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        style={{
          background: currentPage <= 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(244, 180, 31, 0.8)',
          color: currentPage <= 1 ? 'rgba(255, 255, 255, 0.5)' : '#43302b',
          border: 'none',
          borderRadius: '15px',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        ← Previous
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        {showPageInput ? (
          <form onSubmit={handlePageSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              min={1}
              max={totalPages}
              placeholder={currentPage.toString()}
              style={{
                width: '60px',
                padding: '0.5rem',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#43302b',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
              autoFocus
            />
            <span>of {totalPages}</span>
            <button type="submit" style={{
              background: 'rgba(244, 180, 31, 0.8)',
              color: '#43302b',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              Go
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPageInput(false)
                setPageInput('')
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowPageInput(true)}
            style={{
              background: 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
          >
            Page {currentPage} of {totalPages}
          </button>
        )}
      </div>

      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        style={{
          background: currentPage >= totalPages ? 'rgba(255, 255, 255, 0.2)' : 'rgba(244, 180, 31, 0.8)',
          color: currentPage >= totalPages ? 'rgba(255, 255, 255, 0.5)' : '#43302b',
          border: 'none',
          borderRadius: '15px',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Next →
      </button>
    </div>
  )
}