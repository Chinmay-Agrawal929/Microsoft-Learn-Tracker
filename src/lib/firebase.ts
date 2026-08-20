import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0288074083",
  appId: "1:738494137033:web:fd2831e78b12d440518318",
  apiKey: "AIzaSyCvuWoC6X6h7PhkGP6Ms270nldb5vq_xec",
  authDomain: "gen-lang-client-0288074083.firebaseapp.com",
  storageBucket: "gen-lang-client-0288074083.firebasestorage.app",
  messagingSenderId: "738494137033",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-interactivelearn-2d7ab352-4421-40da-8ed8-3bc839b0af1d");

export const microsoftProvider = new OAuthProvider('microsoft.com');

export { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
