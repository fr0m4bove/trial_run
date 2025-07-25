// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - HARDCODED FOR NOW
const firebaseConfig = {
  apiKey: "AIzaSyAtXCvYAPBaAe5qAy9aeFaQp_sYqdmT344",
  authDomain: "pavlovsbook.firebaseapp.com",
  projectId: "pavlovsbook",
  storageBucket: "pavlovsbook.firebasestorage.app",
  messagingSenderId: "495146582856",
  appId: "1:495146582856:web:d59184b70549ab9a61697d"
};

// Debug logging
if (typeof window !== 'undefined') {
  console.log('Firebase Config Loaded:', {
    apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
    authDomain: firebaseConfig.authDomain || '✗ Missing',
    projectId: firebaseConfig.projectId || '✗ Missing',
    storageBucket: firebaseConfig.storageBucket || '✗ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Set' : '✗ Missing',
    appId: firebaseConfig.appId ? '✓ Set' : '✗ Missing',
  });
}

// Initialize Firebase only if not already initialized
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Firebase already initialized');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to LOCAL (survives browser restarts) - IMPORTANT!
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Initialize other services
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;