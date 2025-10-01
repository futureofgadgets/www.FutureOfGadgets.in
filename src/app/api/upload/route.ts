import { NextRequest, NextResponse } from 'next/server'

function validateBase64(base64: string): string {
  // For server-side, we'll just validate and return
  // Compression happens on client-side for better performance
  if (!base64.startsWith('data:image/') && !base64.startsWith('data:application/pdf')) {
    throw new Error('Invalid file format - only images and PDFs are allowed')
  }
  return base64
}

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json()
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // Validate and process files (images and PDFs)
    const processedFiles = images.map((fileData: string, index: number) => {
      try {
        return validateBase64(fileData)
      } catch (error) {
        throw new Error(`Invalid file format at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })

    return NextResponse.json({ 
      success: true, 
      files: processedFiles 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}