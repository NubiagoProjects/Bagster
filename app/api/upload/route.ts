import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Generate a unique filename
    // 3. Store file metadata in database
    // 4. Return the file URL

    // For demo purposes, we'll simulate a successful upload
    const mockFileUrl = `https://api.bagster.com/uploads/${Date.now()}-${file.name}`;

    return NextResponse.json({
      success: true,
      data: {
        url: mockFileUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed. Please try again.'
    }, { status: 500 });
  }
}
