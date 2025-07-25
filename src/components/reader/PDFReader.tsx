'use client'

import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { ThemeProvider } from './ThemeProvider'
import { ReaderControls } from './ReaderControls'
import { ThemeSelector } from './ThemeSelector'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Configure PDF.js worker - use the CDN version for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export type Theme = 'cozy-cabin' | 'midnight-library' | 'rainy-day'

interface PDFReaderProps {
  pdfUrl: string
  bookTitle: string
  bookId?: string
  onClose: () => void
}

interface BookmarkData {
  currentPage: number
  totalPages: number
  lastRead: Date
  bookTitle: string
}

export function PDFReader({ pdfUrl, bookTitle, bookId, onClose }: PDFReaderProps) {
  const { currentUser } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<Theme>('cozy-cabin')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [savingBookmark, setSavingBookmark] = useState(false)
  const [useVintageEffect, setUseVintageEffect] = useState(true)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate a stable ID for the book if bookId isn't provided
  const getBookmarkId = () => {
    return bookId || btoa(pdfUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)
  }

  // Load bookmark on mount
  useEffect(() => {
    loadBookmark()
  }, [currentUser, pdfUrl])

  useEffect(() => {
    loadPDF()
    
    // Cleanup function
    return () => {
      if (pdfDoc) {
        pdfDoc.destroy()
      }
    }
  }, [pdfUrl])

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage)
    }
  }, [pdfDoc, currentPage])

  const loadBookmark = async () => {
    if (!currentUser) return

    try {
      const bookmarkRef = doc(db, 'users', currentUser.uid, 'bookmarks', getBookmarkId())
      const bookmarkDoc = await getDoc(bookmarkRef)
      
      if (bookmarkDoc.exists()) {
        const data = bookmarkDoc.data() as BookmarkData
        setIsBookmarked(true)
        // We'll set the current page after the PDF loads
        if (data.currentPage) {
          setTimeout(() => {
            setCurrentPage(data.currentPage)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error loading bookmark:', error)
    }
  }

  const saveBookmark = async () => {
    if (!currentUser || !totalPages) return

    setSavingBookmark(true)
    try {
      const bookmarkRef = doc(db, 'users', currentUser.uid, 'bookmarks', getBookmarkId())
      const bookmarkData: BookmarkData = {
        currentPage,
        totalPages,
        lastRead: new Date(),
        bookTitle
      }

      await setDoc(bookmarkRef, bookmarkData)
      setIsBookmarked(true)
      
      // Show success feedback
      const originalText = isBookmarked ? 'Bookmark Updated!' : 'Bookmarked!'
      const button = document.getElementById('bookmark-btn')
      if (button) {
        button.textContent = `✅ ${originalText}`
        setTimeout(() => {
          button.textContent = '🔖 ' + (isBookmarked ? 'Update Bookmark' : 'Bookmark')
        }, 2000)
      }
    } catch (error) {
      console.error('Error saving bookmark:', error)
      alert('Failed to save bookmark. Please try again.')
    } finally {
      setSavingBookmark(false)
    }
  }

  const loadPDF = async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadingProgress(0)
      
      console.log('Starting PDF load from:', pdfUrl)
      
      if (!pdfUrl) {
        throw new Error('No PDF URL provided')
      }

      // Method 1: Try to fetch as blob first (handles CORS better)
      try {
        console.log('Attempting to fetch PDF as blob...')
        const response = await fetch(pdfUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const blob = await response.blob()
        console.log('Blob fetched successfully, size:', blob.size)
        
        // Convert blob to ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer()
        
        // Load PDF from ArrayBuffer
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        })
        
        loadingTask.onProgress = (data: any) => {
          const progress = (data.loaded / data.total) * 100
          setLoadingProgress(Math.round(progress))
          console.log(`Loading progress: ${progress}%`)
        }
        
        const pdf = await loadingTask.promise
        console.log('PDF loaded successfully, pages:', pdf.numPages)
        
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        
      } catch (fetchError: any) {
        console.error('Blob fetch failed, trying direct URL:', fetchError)
        
        // Method 2: Fallback to direct URL loading
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false,
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          disableRange: true, // Disable range requests
          disableStream: true, // Disable streaming
        })
        
        loadingTask.onProgress = (data: any) => {
          const progress = (data.loaded / data.total) * 100
          setLoadingProgress(Math.round(progress))
        }
        
        const pdf = await loadingTask.promise
        
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
      }
      
    } catch (err: any) {
      console.error('Error loading PDF:', err)
      
      let errorMessage = 'Failed to load PDF: '
      
      if (err.name === 'MissingPDFException') {
        errorMessage += 'PDF file not found'
      } else if (err.name === 'InvalidPDFException') {
        errorMessage += 'Invalid PDF file'
      } else if (err.name === 'PasswordException') {
        errorMessage += 'PDF is password protected'
      } else if (err.message?.includes('Failed to fetch')) {
        errorMessage += 'Could not download PDF. The file might be restricted or the URL might be invalid.'
      } else {
        errorMessage += err.message || 'Unknown error'
      }
      
      setError(errorMessage)
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
      
      if (!context) {
        throw new Error('Could not get canvas context')
      }
      
      const containerWidth = containerRef.current?.clientWidth || 800
      const maxWidth = Math.min(containerWidth * 0.8, 900) * 0.85 // Reduced by 15%
      
      const viewport = page.getViewport({ scale: 1 })
      const scale = maxWidth / viewport.width
      const scaledViewport = page.getViewport({ scale })

      // Set canvas dimensions
      canvas.height = scaledViewport.height
      canvas.width = scaledViewport.width
      canvas.style.width = `${scaledViewport.width}px`
      canvas.style.height = `${scaledViewport.height}px`

      if (useVintageEffect || currentTheme === 'midnight-library' || currentTheme === 'rainy-day') {
        // Use vintage paper for all themes
        context.fillStyle = '#f4e8d0'
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add paper texture
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, 'rgba(244, 232, 208, 0)')
        gradient.addColorStop(0.4, 'rgba(232, 220, 192, 0.2)')
        gradient.addColorStop(1, 'rgba(212, 196, 160, 0.3)')
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add subtle noise/grain
        const grainDensity = currentTheme === 'midnight-library' ? 2000 : 3000
        for (let i = 0; i < grainDensity; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const opacity = Math.random() * 0.05
          context.fillStyle = currentTheme === 'midnight-library' 
            ? `rgba(200, 200, 255, ${opacity})`
            : `rgba(139, 69, 19, ${opacity})`
          context.fillRect(x, y, 1, 1)
        }
        
        // Create temporary canvas for PDF rendering
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempContext = tempCanvas.getContext('2d')
        
        if (tempContext) {
          // Add font style for midnight library
          if (currentTheme === 'midnight-library') {
            tempContext.font = 'Georgia, serif' // This will be overridden by PDF, but sets a baseline
          }
          
          // Render PDF to temporary canvas
          const renderContext = {
            canvasContext: tempContext,
            viewport: scaledViewport,
          }
          
          await page.render(renderContext).promise
          
          // Process the image data to remove white background
          const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
          const data = imageData.data
          
          // Remove white background and apply theme-specific text color
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            
            // If pixel is white or near-white, make it transparent
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0 // Set alpha to 0 (transparent)
            } else if (currentTheme === 'midnight-library') {
              // Make text slightly blue-tinted for midnight library
              data[i] = Math.max(0, r - 30) // Less red
              data[i + 1] = Math.max(0, g - 20) // Slightly less green
              data[i + 2] = Math.min(255, b + 10) // Slightly more blue
            } else {
              // Darken the text slightly for vintage feel
              data[i] = Math.max(0, r - 20)
              data[i + 1] = Math.max(0, g - 20)
              data[i + 2] = Math.max(0, b - 20)
            }
          }
          
          // Put processed image back
          tempContext.putImageData(imageData, 0, 0)
          
          // Draw the processed PDF onto our themed background
          context.drawImage(tempCanvas, 0, 0)
          
          // Add final theme touches
          context.globalCompositeOperation = 'multiply'
          context.fillStyle = 'rgba(245, 222, 179, 0.1)'
          context.fillRect(0, 0, canvas.width, canvas.height)
          context.globalCompositeOperation = 'source-over'
        }
      } else {
        // Normal rendering without vintage effect
        context.clearRect(0, 0, canvas.width, canvas.height)
        
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        }

        await page.render(renderContext).promise
      }
      
      console.log(`Page ${pageNum} rendered successfully`)
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
          {loadingProgress > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                width: '200px',
                height: '4px',
                background: 'rgba(244, 180, 31, 0.3)',
                borderRadius: '2px',
                overflow: 'hidden',
                margin: '0 auto'
              }}>
                <div style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  background: '#f4b41f',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{loadingProgress}%</p>
            </div>
          )}
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
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'Crimson Text, serif', marginBottom: '1rem' }}>
            Unable to Load Book
          </h2>
          <p style={{ marginBottom: '1rem', color: '#ff6b6b' }}>{error}</p>
          <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#bfa094' }}>
            The PDF can be opened in your browser where it should work correctly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
            <button onClick={loadPDF} style={{
              background: 'rgba(244, 180, 31, 0.3)', color: '#f4b41f',
              border: '1px solid rgba(244, 180, 31, 0.5)',
              padding: '1rem 2rem', borderRadius: '25px', cursor: 'pointer'
            }}>
              Try Again
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
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {currentUser && (
              <button 
                id="bookmark-btn"
                onClick={saveBookmark}
                disabled={savingBookmark}
                style={{
                  background: isBookmarked ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 180, 31, 0.8)',
                  color: isBookmarked ? 'white' : '#43302b',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '0.75rem 1.5rem',
                  cursor: savingBookmark ? 'wait' : 'pointer',
                  opacity: savingBookmark ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {savingBookmark ? '⏳ Saving...' : `🔖 ${isBookmarked ? 'Update Bookmark' : 'Bookmark'}`}
              </button>
            )}
            <button onClick={() => setShowThemeSelector(!showThemeSelector)} style={{
              background: 'rgba(244, 180, 31, 0.8)', color: '#43302b', border: 'none',
              borderRadius: '25px', padding: '0.75rem 1.5rem', cursor: 'pointer'
            }}>
              🎨 Themes
            </button>
          </div>
        </div>

        {showThemeSelector && (
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            onClose={() => setShowThemeSelector(false)}
          />
        )}

        {/* PDF Canvas with Theme Effects */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '2rem', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 200px)', 
          overflow: 'auto'
        }}>
          {/* Canvas container - theme aware */}
          <div style={{
            position: 'relative',
            background: (useVintageEffect || currentTheme === 'midnight-library' || currentTheme === 'rainy-day') ? 'transparent' : '#2c3e50',
            borderRadius: '10px',
            padding: (useVintageEffect || currentTheme === 'midnight-library' || currentTheme === 'rainy-day') ? '0' : '20px',
            boxShadow: (useVintageEffect || currentTheme === 'midnight-library' || currentTheme === 'rainy-day') ? 'none' : 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            <canvas 
              ref={canvasRef} 
              style={{
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '10px',
                boxShadow: currentTheme === 'midnight-library' 
                  ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 80px rgba(100, 100, 200, 0.1)'
                  : '0 10px 30px rgba(0, 0, 0, 0.4)',
                display: 'block',
                margin: '0 auto',
                border: (useVintageEffect || currentTheme === 'midnight-library' || currentTheme === 'rainy-day') 
                  ? '1px solid rgba(139, 69, 19, 0.2)'
                  : 'none'
              }} 
            />
          </div>
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