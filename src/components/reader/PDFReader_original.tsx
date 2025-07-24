'use client'

import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { ThemeProvider } from './ThemeProvider'
import { ReaderControls } from './ReaderControls'
import { ThemeSelector } from './ThemeSelector'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js'
}

export type Theme = 'cozy-cabin' | 'midnight-library' | 'rainy-day'

interface PDFReaderProps {
  pdfUrl: string
  bookTitle: string
  onClose: () => void
}

export function PDFReader({ pdfUrl, bookTitle, onClose }: PDFReaderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('cozy-cabin')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPDF()
  }, [pdfUrl])

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage)
    }
  }, [pdfDoc, currentPage])

  const loadPDF = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js'
      }
      
      const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
      const pdf = await loadingTask.promise
      
      setPdfDoc(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)
    } catch (err: any) {
      console.error('Error loading PDF:', err)
      setError(`Failed to load PDF: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return

    try {
      const page = await pdfDoc.getPage(pageNum)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      const containerWidth = containerRef.current?.clientWidth || 800
      const maxWidth = Math.min(containerWidth * 0.8, 900)
      
      const viewport = page.getViewport({ scale: 1 })
      const scale = maxWidth / viewport.width
      const scaledViewport = page.getViewport({ scale })

      canvas.height = scaledViewport.height
      canvas.width = scaledViewport.width
      canvas.style.width = `${scaledViewport.width}px`
      canvas.style.height = `${scaledViewport.height}px`

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      }

      await page.render(renderContext).promise
    } catch (err) {
      console.error('Error rendering page:', err)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: '#f4b41f'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontFamily: 'Crimson Text, serif', marginBottom: '1rem' }}>
            Preparing your reading sanctuary...
          </h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: '#f4b41f'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'Crimson Text, serif', marginBottom: '1rem' }}>
            Unable to Load Book
          </h2>
          <p style={{ marginBottom: '2rem', color: '#ff6b6b' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={onClose} style={{
              background: '#f4b41f', color: '#43302b', border: 'none',
              padding: '1rem 2rem', borderRadius: '25px', cursor: 'pointer'
            }}>
              Return to Library
            </button>
            <button onClick={() => window.open(pdfUrl, '_blank')} style={{
              background: 'rgba(255, 255, 255, 0.2)', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '1rem 2rem', borderRadius: '25px', cursor: 'pointer'
            }}>
              Open in Browser
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, overflow: 'hidden'
    }}>
      <ThemeProvider theme={currentTheme} />
      
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '2rem'
      }}>
        
        {/* Top Controls */}
        <div style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
        }}>
          <button onClick={onClose} style={{
            background: 'rgba(0, 0, 0, 0.7)', color: 'white', border: 'none',
            borderRadius: '50%', width: '50px', height: '50px',
            fontSize: '1.5rem', cursor: 'pointer', backdropFilter: 'blur(10px)'
          }}>×</button>
          
          <h1 style={{
            fontFamily: 'Crimson Text, serif', fontSize: '1.5rem',
            color: 'white', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>{bookTitle}</h1>
          
          <button onClick={() => setShowThemeSelector(!showThemeSelector)} style={{
            background: 'rgba(244, 180, 31, 0.8)', color: '#43302b', border: 'none',
            borderRadius: '25px', padding: '0.75rem 1.5rem', cursor: 'pointer'
          }}>
            🎨 Themes
          </button>
        </div>

        {showThemeSelector && (
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            onClose={() => setShowThemeSelector(false)}
          />
        )}

        {/* PDF Canvas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '2rem', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 200px)', overflow: 'auto'
        }}>
          <canvas ref={canvasRef} style={{
            maxWidth: '100%', height: 'auto', borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }} />
        </div>

        <ReaderControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onGoToPage={goToPage}
        />
      </div>
    </div>
  )
}