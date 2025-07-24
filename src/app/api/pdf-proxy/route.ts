import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pdfUrl = searchParams.get('url')
    
    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      )
    }

    // Validate that it's a Firebase Storage URL for security
    if (!pdfUrl.includes('firebasestorage.googleapis.com')) {
      return NextResponse.json(
        { error: 'Invalid PDF URL' },
        { status: 400 }
      )
    }

    console.log('Proxying PDF from:', pdfUrl)

    // Fetch the PDF from Firebase Storage
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }

    // Get the PDF data
    const pdfData = await response.arrayBuffer()

    // Return the PDF with proper headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfData.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('PDF proxy error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch PDF' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}