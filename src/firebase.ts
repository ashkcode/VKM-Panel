import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

/**
 * VKM plugin
 * - Preferon .env (VITE_FIREBASE_*)
 * - Ka fallback te config i vjetër që e kishe hardcoded
 */
const firebaseConfig = {
  apiKey:
    (import.meta.env.VITE_FIREBASE_API_KEY as string) ||
    "AIzaSyAUjQRXi_A8wHSW7cZoWG85xzLHmI49WQ0",
  authDomain:
    (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) ||
    "localdb-pro.firebaseapp.com",
  projectId:
    (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || "localdb-pro",
  storageBucket:
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) ||
    "localdb-pro.firebasestorage.app",
  messagingSenderId:
    (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) ||
    "334689487080",
  appId:
    (import.meta.env.VITE_FIREBASE_APP_ID as string) ||
    "1:334689487080:web:0a4b2efa8125cb74de615d",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Pa login UI, por me Auth në background (që të kalojnë Rules)
signInAnonymously(auth).catch((e) => {
  console.error("Anonymous auth failed:", e);
});