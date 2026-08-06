import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKD_On18rQ7MnmDRuMetHDfDg2VydoGX0",
  authDomain: "sangam-project-1.firebaseapp.com",
  projectId: "sangam-project-1",
  storageBucket: "sangam-project-1.firebasestorage.app",
  messagingSenderId: "378628019162",
  appId: "1:378628019162:web:a85834f91dea28e41fa6e3",
};

// Safe Initialization for Next.js SSR
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);