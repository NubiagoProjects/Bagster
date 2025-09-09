// Mock authentication service for testing
export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'admin' | 'carrier';
  verified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for testing
export const mockUsers: User[] = [
  {
    id: 'admin_001',
    email: 'admin@bagster.com',
    name: 'Admin User',
    userType: 'admin',
    verified: true
  },
  {
    id: 'carrier_001', 
    email: 'carrier@bagster.com',
    name: 'Carrier User',
    userType: 'carrier',
    verified: true
  }
];

// Get current auth state from localStorage
export const getCurrentUser = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const storedUser = localStorage.getItem('user');
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (storedUser && sessionToken) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error('Error reading auth state:', error);
  }

  return { user: null, isAuthenticated: false };
};

// Auto-login for testing (bypasses Firebase)
export const autoLogin = (userType: 'admin' | 'carrier' = 'admin'): AuthState => {
  const user = mockUsers.find(u => u.userType === userType) || mockUsers[0];
  const sessionToken = `mock_session_${user.id}_${Date.now()}`;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sessionToken', sessionToken);
  }
  
  return {
    user,
    isAuthenticated: true
  };
};

// Logout function
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser().isAuthenticated;
};

// Get user type for routing
export const getUserType = (): 'admin' | 'carrier' | null => {
  const { user } = getCurrentUser();
  return user?.userType || null;
};
