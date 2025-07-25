// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Using NoiseBeforeDefeat's hardcoded config approach
const firebaseConfig = {
  apiKey: "AIzaSyBR2ReY-IvGoJ_7uxDLfE_RF1uuYrNZoJk",
  authDomain: "noise-before-defeat.firebaseapp.com",
  projectId: "noise-before-defeat",
  storageBucket: "noise-before-defeat.firebasestorage.app",
  messagingSenderId: "2654438157788",
  appId: "1:2654438157788:web:b385e9edb4zd5099ab8349",
  measurementId: "G-X5DJBNBT9D",
  databaseURL: "https://noise-before-defeat-default-rtdb.firebaseio.com/" // Add this for Realtime Database
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app); // For compatibility with NoiseBeforeDefeat patterns

export default app;