// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNx39YwBSTrLUtFkb1pxpK4sZzVbNiqGE",
  authDomain: "swapit-15d3a.firebaseapp.com",
  projectId: "swapit-15d3a",
  storageBucket: "swapit-15d3a.appspot.com", // ✅ corrected
  messagingSenderId: "478174892643",
  appId: "1:478174892643:web:7e1c9d86c677809f771e56",
  measurementId: "G-BV88412MF8"
};

// ✅ Only initialize if no app has been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };
