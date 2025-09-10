import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

// Mock database - replace with your actual database
let apiKeysDB: ApiKeyRecord[] = [];
let usageDB: ApiKeyUsage[] = [];

interface ApiKeyRecord {
  id: string;
  keyHash: string;
  name: string;
  userId: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    lastResetDate: string;
  };
}

interface ApiKeyUsage {
  keyId: string;
  endpoint: string;
  method: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  ipAddress?: string;
}

interface CreateApiKeyRequest {
  name: string;
  permissions?: string[];
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  expiresAt?: string;
}

// Generate API key
function generateApiKey(): { rawKey: string; keyHash: string } {
  const rawKey = `bgs_${crypto.randomBytes(32).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

// Validate API key
function validateApiKey(rawKey: string): ApiKeyRecord | null {
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const keyRecord = apiKeysDB.find(key => key.keyHash === keyHash && key.isActive);
  
  if (!keyRecord) return null;
  
  // Check expiration
  if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
    keyRecord.isActive = false;
    return null;
  }
  
  return keyRecord;
}

// POST /api/v1/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const body: CreateApiKeyRequest = await request.json();
    
    // Validate required fields
    if (!body.name || body.name.trim().length < 3) {
      return NextResponse.json({
        success: false,
        error: 'API key name must be at least 3 characters long'
      }, { status: 400 });
    }

    // Generate API key
    const { rawKey, keyHash } = generateApiKey();
    
    // Create API key record
    const apiKeyRecord: ApiKeyRecord = {
      id: uuidv4(),
      keyHash,
      name: body.name.trim(),
      userId: 'admin-user', // In production, get from authenticated user
      permissions: body.permissions || [
        'rates:read',
        'shipments:create', 
        'tracking:read',
        'carriers:read',
        'smart-selection:read'
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt,
      rateLimit: body.rateLimit || {
        requestsPerMinute: 60,
        requestsPerDay: 1000
      },
      usage: {
        totalRequests: 0,
        requestsToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      }
    };

    // Save to database
    apiKeysDB.push(apiKeyRecord);

    // Return response (only show raw key once during creation)
    return NextResponse.json({
      success: true,
      data: {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        apiKey: rawKey, // Only shown during creation
        permissions: apiKeyRecord.permissions,
        rateLimit: apiKeyRecord.rateLimit,
        createdAt: apiKeyRecord.createdAt,
        expiresAt: apiKeyRecord.expiresAt,
        isActive: apiKeyRecord.isActive
      }
    }, { status: 201 });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create API key'
    }, { status: 500 });
  }
}

// GET /api/v1/api-keys - List API keys
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'admin-user';

    // Get user's API keys (excluding sensitive data)
    const userKeys = apiKeysDB
      .filter(key => key.userId === userId)
      .map(key => ({
        id: key.id,
        name: key.name,
        permissions: key.permissions,
        isActive: key.isActive,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt,
        rateLimit: key.rateLimit,
        usage: key.usage,
        // Mask the key for security
        keyPreview: `bgs_${'*'.repeat(32)}...${key.keyHash.slice(-8)}`
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: {
        apiKeys: userKeys,
        total: userKeys.length,
        active: userKeys.filter(key => key.isActive).length
      }
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch API keys'
    }, { status: 500 });
  }
}

// DELETE /api/v1/api-keys - Deactivate API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');
    const userId = searchParams.get('userId') || 'admin-user';

    if (!keyId) {
      return NextResponse.json({
        success: false,
        error: 'API key ID is required'
      }, { status: 400 });
    }

    // Find and verify ownership
    const keyIndex = apiKeysDB.findIndex(key => 
      key.id === keyId && key.userId === userId
    );

    if (keyIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'API key not found or access denied'
      }, { status: 404 });
    }

    // Deactivate the key
    apiKeysDB[keyIndex].isActive = false;
    apiKeysDB[keyIndex].lastUsedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'API key deactivated successfully'
    });

  } catch (error) {
    console.error('API key deactivation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to deactivate API key'
    }, { status: 500 });
  }
}

// PUT /api/v1/api-keys - Update API key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyId, name, permissions, rateLimit } = body;

    if (!keyId) {
      return NextResponse.json({
        success: false,
        error: 'API key ID is required'
      }, { status: 400 });
    }

    // Find key
    const keyIndex = apiKeysDB.findIndex(key => key.id === keyId);
    
    if (keyIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'API key not found'
      }, { status: 404 });
    }

    // Update key
    if (name) apiKeysDB[keyIndex].name = name;
    if (permissions) apiKeysDB[keyIndex].permissions = permissions;
    if (rateLimit) apiKeysDB[keyIndex].rateLimit = rateLimit;

    return NextResponse.json({
      success: true,
      data: {
        id: apiKeysDB[keyIndex].id,
        name: apiKeysDB[keyIndex].name,
        permissions: apiKeysDB[keyIndex].permissions,
        rateLimit: apiKeysDB[keyIndex].rateLimit,
        isActive: apiKeysDB[keyIndex].isActive
      }
    });

  } catch (error) {
    console.error('API key update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update API key'
    }, { status: 500 });
  }
}
