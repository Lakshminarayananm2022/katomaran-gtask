import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Debug Firebase config
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Check if all required Firebase config values are present
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
for (const field of requiredConfig) {
  if (!firebaseConfig[field]) {
    console.error(`Missing Firebase config field: ${field}`);
    throw new Error(`Missing required Firebase config field: ${field}`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use emulator in development
if (process.env.NODE_ENV === 'development') {
  console.log('Using Firebase Auth Emulator');
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { auth };
