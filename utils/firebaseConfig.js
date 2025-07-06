// utils/firebaseConfig.js (or src/firebaseConfig.js)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAYm4HN1RV43mYbT8y9NZacPI0YXvvM0MI",
  authDomain: "narsingdi-transit.firebaseapp.com",
  projectId: "narsingdi-transit",
  storageBucket: "narsingdi-transit.appspot.com",
  messagingSenderId: "1033915031162",
  appId: "1:1033915031162:web:76dc3bdb23b26323d7e5c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance
export const auth = getAuth(app);
