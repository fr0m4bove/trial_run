'use client'

import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Test different worker configurations
const WORKER_OPTIONS = [
  { name: 'CDN Latest', url: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js` },
  { name: 'CDN Specific', url: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' },
  { name: 'Local Public', url: '/pdf.worker.min.js' },
  { name: 'Local JS', url: '/js/pdf.worker.min.js' },
]

export default function TestSimplePDF() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [pdfUrl, setPdfUrl] = useState('')
  const [workerIndex, setWorkerIndex] = useState(0)

  const log = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testPDF = async () => {
    if (!pdfUrl) {
      log('❌ Please enter a PDF URL')
      return
    }

    const worker = WORKER_OPTIONS[workerIndex]
    log(`\n🔧 Testing with worker: ${worker.name}`)
    log(`Worker URL: ${worker.url}`)
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = worker.url

    try {
      // Method 1: Direct URL
      log('📄 Attempting direct URL load...')
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      
      loadingTask.onProgress = (data: any) => {
        log(`Progress: ${data.loaded} / ${data.total}`)
      }

      const pdf = await loadingTask.promise
      log(`✅ PDF loaded! Pages: ${pdf.numPages}`)

      // Try to render first page
      const page = await pdf.getPage(1)
      log('📄 Got first page')

      const viewport = page.getViewport({ scale: 1 })
      log(`Page size: ${viewport.width} x ${viewport.height}`)

      if (canvasRef.current) {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        
        if (!context) {
          log('❌ Could not get canvas context')
          return
        }
        
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context as CanvasRenderingContext2D,
          viewport: viewport
        }).promise

        log('✅ Page rendered successfully!')
      }

      pdf.destroy()
    } catch (error: any) {
      log(`❌ Error: ${error.name} - ${error.message}`)
      console.error('Full error:', error)
    }
  }

  const testFetch = async () => {
    if (!pdfUrl) return

    log('\n🌐 Testing direct fetch...')
    try {
      const response = await fetch(pdfUrl)
      log(`Response status: ${response.status}`)
      log(`Content-Type: ${response.headers.get('content-type')}`)
      log(`Content-Length: ${response.headers.get('content-length')}`)
      
      const blob = await response.blob()
      log(`✅ Blob received: ${blob.size} bytes, type: ${blob.type}`)
    } catch (error: any) {
      log(`❌ Fetch error: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>PDF.js Debug Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          placeholder="Enter Firebase Storage PDF URL"
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}
        />
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Worker Source: </label>
          <select 
            value={workerIndex} 
            onChange={(e) => setWorkerIndex(Number(e.target.value))}
            style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
          >
            {WORKER_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={testPDF}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test PDF Load
          </button>
          
          <button
            onClick={testFetch}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Fetch
          </button>
          
          <button
            onClick={() => setLogs([])}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>Logs:</h3>
          <div style={{
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            height: '400px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {logs.length === 0 ? 'Logs will appear here...' : logs.join('\n')}
          </div>
        </div>
        
        <div>
          <h3>Canvas Preview:</h3>
          <div style={{
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '4px',
            height: '400px',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <canvas 
              ref={canvasRef} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                border: '1px solid #ddd'
              }} 
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e9ecef', borderRadius: '4px' }}>
        <h4>PDF.js Info:</h4>
        <p>Version: {pdfjsLib.version}</p>
        <p>Current Worker: {pdfjsLib.GlobalWorkerOptions.workerSrc || 'Not set'}</p>
      </div>
    </div>
  )
}