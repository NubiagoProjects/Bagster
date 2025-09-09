import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers = [
  {
    id: 'user_001',
    email: 'admin@bagster.com',
    password: 'admin123', // In production, this would be hashed
    userType: 'admin',
    name: 'Admin User',
    verified: true
  },
  {
    id: 'user_002',
    email: 'carrier@bagster.com',
    password: 'carrier123',
    userType: 'carrier',
    name: 'Carrier User',
    verified: true
  },
  {
    id: 'user_003',
    email: 'demo@bagster.com',
    password: 'demo123',
    userType: 'carrier',
    name: 'Demo User',
    verified: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and user type are required'
      }, { status: 400 });
    }

    // Find user - Allow any matching email/password regardless of userType for testing
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Override userType with the requested one for dashboard access
    const effectiveUserType = userType;

    // Create session token (in production, use JWT or secure session)
    const sessionToken = `session_${user.id}_${Date.now()}`;

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: effectiveUserType,
          verified: user.verified
        },
        sessionToken,
        redirectUrl: effectiveUserType === 'admin' ? '/admin/dashboard' : 
                    effectiveUserType === 'carrier' ? '/carrier/dashboard' : '/dashboard'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
