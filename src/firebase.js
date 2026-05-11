import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5hKtPlopoZMHaxTLns6GS886uU58g3UI",
  authDomain: "moodemployee-dae2f.firebaseapp.com",
  projectId: "moodemployee-dae2f",
  storageBucket: "moodemployee-dae2f.firebasestorage.app",
  messagingSenderId: "498263591143",
  appId: "1:498263591143:web:c7be6a7cedac920737fa42"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);