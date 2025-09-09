import { NextRequest, NextResponse } from 'next/server';

// Mock user database (in production, this would be a real database)
let mockUsers = [
  {
    id: 'user_001',
    email: 'admin@bagster.com',
    password: 'admin123',
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
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      confirmPassword, 
      userType, 
      companyName, 
      contactPerson, 
      phone, 
      terms 
    } = body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !userType || !companyName || !contactPerson || !phone) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Passwords do not match'
      }, { status: 400 });
    }

    // Validate terms acceptance
    if (!terms) {
      return NextResponse.json({
        success: false,
        error: 'You must accept the terms and conditions'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 });
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      password, // In production, hash this password
      userType,
      name: contactPerson,
      companyName,
      phone,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Create session token
    const sessionToken = `session_${newUser.id}_${Date.now()}`;

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          userType: newUser.userType,
          companyName: newUser.companyName,
          verified: newUser.verified
        },
        sessionToken,
        message: 'Registration successful! Welcome to Bagster.',
        redirectUrl: userType === 'admin' ? '/admin/dashboard' : 
                    userType === 'carrier' ? '/carrier/dashboard' : '/dashboard'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
