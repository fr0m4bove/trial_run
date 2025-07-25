// /src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAtXCvYAPBaAe5qAy9aeFaQp_sYqdmT344",
  authDomain: "pavlovsbook.firebaseapp.com",
  projectId: "pavlovsbook",
  storageBucket: "pavlovsbook.firebasestorage.app",
  messagingSenderId: "495146582856",
  appId: "1:495146582856:web:d59184b70549ab9a61697d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);