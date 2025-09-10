import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';
import * as jwt from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'admin' | 'carrier' | 'customer';
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    phone?: string;
    address?: string;
    company?: string;
    avatar?: string;
  };
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: 'admin' | 'carrier' | 'customer';
  phone?: string;
  company?: string;
}

class AuthService {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await this.getUserData(firebaseUser.uid);
          this.updateAuthState({
            user: userData,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.updateAuthState({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      } else {
        this.updateAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    });
  }

  private updateAuthState(newState: AuthState) {
    this.authState = newState;
    this.listeners.forEach(listener => listener(newState));
  }

  public subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getAuthState(): AuthState {
    return this.authState;
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const userData = await this.getUserData(userCredential.user.uid);
      
      // Generate JWT token
      const token = this.generateJWT(userData);
      localStorage.setItem('authToken', token);
      
      return userData;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async register(data: RegisterData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      // Create user document in Firestore
      const userData: User = {
        id: userCredential.user.uid,
        email: data.email,
        name: data.name,
        userType: data.userType,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          phone: data.phone,
          company: data.company
        },
        permissions: this.getDefaultPermissions(data.userType)
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // Generate JWT token
      const token = this.generateJWT(userData);
      localStorage.setItem('authToken', token);

      return userData;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async logout(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, updateData);
      
      const updatedUser = await this.getUserData(userId);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  private async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    const data = userDoc.data();
    return {
      ...data,
      id: uid,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as User;
  }

  private generateJWT(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      permissions: user.permissions || []
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string
    };

    return jwt.sign(payload, secret, options);
  }

  public verifyJWT(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private getDefaultPermissions(userType: string): string[] {
    switch (userType) {
      case 'admin':
        return [
          'users:read', 'users:write', 'users:delete',
          'carriers:read', 'carriers:write', 'carriers:delete',
          'shipments:read', 'shipments:write', 'shipments:delete',
          'analytics:read', 'api-keys:read', 'api-keys:write'
        ];
      case 'carrier':
        return [
          'shipments:read', 'shipments:update',
          'assignments:read', 'assignments:write',
          'tracking:read', 'tracking:write'
        ];
      case 'customer':
        return [
          'shipments:create', 'shipments:read',
          'tracking:read', 'rates:read'
        ];
      default:
        return [];
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  public async getUsersByType(userType: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('userType', '==', userType)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[];
    } catch (error) {
      console.error('Error fetching users by type:', error);
      throw new Error('Failed to fetch users');
    }
  }

  public hasPermission(permission: string): boolean {
    const user = this.authState.user;
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes(permission) || 
           user.userType === 'admin'; // Admins have all permissions
  }
}

// Export singleton instance
export const authService = new AuthService();

// Convenience exports
export const getCurrentUser = () => authService.getAuthState();
export const login = (credentials: LoginCredentials) => authService.login(credentials);
export const register = (data: RegisterData) => authService.register(data);
export const logout = () => authService.logout();
export const isAuthenticated = () => authService.getAuthState().isAuthenticated;
export const getUserType = () => authService.getAuthState().user?.userType || null;
export const hasPermission = (permission: string) => authService.hasPermission(permission);
