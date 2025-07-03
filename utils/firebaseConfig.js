// utils/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYm4HN1RV43mYbT8y9NZacPI0YXvvM0MI",
  authDomain: "narsingdi-transit.firebaseapp.com",
  projectId: "narsingdi-transit",
  storageBucket: "narsingdi-transit.appspot.com",
  messagingSenderId: "1033915031162",
  appId: "1:1033915031162:web:76dc3bdb23b26323d7e5c3"
};

// ✅ Initialize Firebase app (only once)
const app = initializeApp(firebaseConfig);

// ✅ Get Firestore instance
const db = getFirestore(app);

// ✅ Export db to use in your app
export { db };
