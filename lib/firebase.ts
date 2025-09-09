// Firebase disabled for testing - using mock authentication
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getFunctions } from "firebase/functions";

// Mock Firebase services for testing
export const auth = null;
export const db = null;
export const storage = null;
export const functions = null;
export const analytics = null;

// Mock app export
export default null;

// Mock authentication state
export const mockAuthState = {
  user: {
    id: 'mock_user_001',
    email: 'test@bagster.com',
    name: 'Test User',
    userType: 'admin',
    verified: true
  },
  isAuthenticated: true
};