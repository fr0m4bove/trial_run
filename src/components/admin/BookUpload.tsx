// src/components/admin/BookUpload.tsx - Updated with Firebase integration
'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { db, storage } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'

interface BookData {
  title: string
  description: string
  coverFile: File | null
  pdfFile: File | null
}

export function BookUpload() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookData, setBookData] = useState<BookData>({
    title: '',
    description: '',
    coverFile: null,
    pdfFile: null
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(file => file.type === 'application/pdf')
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (pdfFile) {
      setBookData(prev => ({ ...prev, pdfFile }))
    }
    if (imageFile) {
      setBookData(prev => ({ ...prev, coverFile: imageFile }))
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setBookData(prev => ({ ...prev, pdfFile: file }))
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setBookData(prev => ({ ...prev, coverFile: file }))
    }
  }

  const uploadFile = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error('Upload error:', error)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookData.title || !bookData.pdfFile || !user) {
      alert('Please fill in all required fields and make sure you are logged in.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Generate unique filenames
      const timestamp = Date.now()
      const bookId = `book_${timestamp}`
      
      setUploadStatus('Uploading PDF...')
      
      // Upload PDF file
      const pdfPath = `books/${bookId}/content.pdf`
      const pdfUrl = await uploadFile(bookData.pdfFile, pdfPath)
      
      setUploadStatus('Uploading cover image...')
      
      // Upload cover image if provided
      let coverUrl = ''
      if (bookData.coverFile) {
        const coverPath = `books/${bookId}/cover.${bookData.coverFile.name.split('.').pop()}`
        coverUrl = await uploadFile(bookData.coverFile, coverPath)
      }

      setUploadStatus('Saving book data...')
      
      // Save book metadata to Firestore
      const bookDoc = {
        title: bookData.title,
        description: bookData.description,
        pdfUrl: pdfUrl,
        coverUrl: coverUrl,
        uploadedBy: user.uid,
        authorId: user.uid, // Map to your existing field
        uploadedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add additional metadata
        fileSize: bookData.pdfFile.size,
        fileName: bookData.pdfFile.name,
        status: 'published',
        isPublished: true, // Map to your existing field
        chapters: [], // Initialize as empty array
        totalChapters: 0, // Will be updated when PDF is processed
        metadata: {
          originalFileName: bookData.pdfFile.name,
          fileSize: bookData.pdfFile.size,
          processingStatus: 'pending' as const
        }
      }

      const docRef = await addDoc(collection(db, 'books'), bookDoc)
      
      setUploadProgress(100)
      setUploadStatus('Book published successfully!')
      
      setTimeout(() => {
        alert('Book uploaded successfully!')
        // Reset form
        setBookData({ title: '', description: '', coverFile: null, pdfFile: null })
        setUploadProgress(0)
        setIsUploading(false)
        setUploadStatus('')
        
        // Redirect to manage books page
        router.push('/admin/books')
      }, 1000)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStatus('')
    }
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
        maxWidth: '800px',
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
                Add New Book
              </h1>
              <p style={{
                color: '#5d4037',
                margin: 0,
                fontSize: '1rem'
              }}>
                Upload a new book to your literary sanctuary
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontFamily: 'Crimson Text, serif',
              fontSize: '1.5rem',
              color: '#43302b',
              marginBottom: '1.5rem'
            }}>
              📝 Book Information
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#5d4037',
                marginBottom: '0.5rem'
              }}>
                Book Title *
              </label>
              <input
                type="text"
                value={bookData.title}
                onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(244, 180, 31, 0.2)',
                  fontSize: '1rem',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
                placeholder="Enter the book title..."
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#5d4037',
                marginBottom: '0.5rem'
              }}>
                Description
              </label>
              <textarea
                value={bookData.description}
                onChange={(e) => setBookData(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid rgba(244, 180, 31, 0.2)',
                  fontSize: '1rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                placeholder="Write a compelling description for your readers..."
              />
            </div>
          </div>

          {/* File Uploads */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            
            {/* PDF Upload */}
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontFamily: 'Crimson Text, serif',
                fontSize: '1.25rem',
                color: '#43302b',
                marginBottom: '1rem'
              }}>
                📄 Book File (PDF)
              </h3>
              
              <div
                style={{
                  border: `2px dashed ${dragActive ? '#f4b41f' : 'rgba(244, 180, 31, 0.3)'}`,
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: dragActive ? 'rgba(244, 180, 31, 0.05)' : 'transparent'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => pdfInputRef.current?.click()}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {bookData.pdfFile ? '✅' : '📁'}
                </div>
                <p style={{
                  color: '#5d4037',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  {bookData.pdfFile ? bookData.pdfFile.name : 'Drop PDF file here or click to browse'}
                </p>
                <p style={{
                  color: '#8d6e63',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  Supports PDF files up to 50MB
                </p>
              </div>
              
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Cover Upload */}
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontFamily: 'Crimson Text, serif',
                fontSize: '1.25rem',
                color: '#43302b',
                marginBottom: '1rem'
              }}>
                🎨 Book Cover (Optional)
              </h3>
              
              <div
                style={{
                  border: '2px dashed rgba(244, 180, 31, 0.3)',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => coverInputRef.current?.click()}
              >
                {bookData.coverFile ? (
                  <div>
                    <img
                      src={URL.createObjectURL(bookData.coverFile)}
                      alt="Cover preview"
                      style={{
                        maxWidth: '100px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}
                    />
                    <p style={{ color: '#5d4037', fontSize: '0.9rem' }}>
                      {bookData.coverFile.name}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🖼️</div>
                    <p style={{
                      color: '#5d4037',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Upload cover image
                    </p>
                    <p style={{
                      color: '#8d6e63',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div style={{
              background: 'rgba(253, 248, 246, 0.95)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid rgba(244, 180, 31, 0.2)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontFamily: 'Crimson Text, serif',
                fontSize: '1.25rem',
                color: '#43302b',
                marginBottom: '1rem'
              }}>
                🚀 Processing Your Book...
              </h3>
              
              <div style={{
                background: 'rgba(244, 180, 31, 0.1)',
                borderRadius: '10px',
                height: '10px',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: '#f4b41f',
                  height: '100%',
                  borderRadius: '10px',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              
              <p style={{ color: '#5d4037', margin: 0 }}>
                {uploadStatus || 'Preparing upload...'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div style={{
            background: 'rgba(253, 248, 246, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(244, 180, 31, 0.2)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <button
              type="submit"
              disabled={!bookData.title || !bookData.pdfFile || isUploading || !user}
              style={{
                background: (!bookData.title || !bookData.pdfFile || isUploading || !user) ? '#bfa094' : '#f4b41f',
                color: '#43302b',
                border: 'none',
                padding: '1rem 3rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: (!bookData.title || !bookData.pdfFile || isUploading || !user) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(244, 180, 31, 0.3)'
              }}
            >
              {isUploading ? '🚀 Publishing...' : '📚 Publish Book'}
            </button>
            
            <p style={{
              color: '#8d6e63',
              fontSize: '0.9rem',
              marginTop: '1rem',
              margin: 0
            }}>
              {!user ? 'Please log in to upload books' : 'Your book will be processed and made available to readers immediately'}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}