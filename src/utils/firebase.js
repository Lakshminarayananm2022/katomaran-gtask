import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCFJjFpKqM6PtaEenOk35jEgtiSiW8mpao",
  authDomain: "todo-list-3ac8a.firebaseapp.com",
  projectId: "todo-list-3ac8a",
  storageBucket: "todo-list-3ac8a.firebasestorage.app",
  messagingSenderId: "879988264082",
  appId: "1:879988264082:web:939013a0fe8c072587aa4b",
  measurementId: "G-YC3D1LG75B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
