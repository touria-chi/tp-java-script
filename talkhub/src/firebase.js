
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqkG3R1-YnEcZ8bmp7S5Pljfb8h3KSPEE",
  authDomain: "forum-28fe0.firebaseapp.com",
  projectId: "forum-28fe0",
  storageBucket: "forum-28fe0.firebasestorage.app",
  messagingSenderId: "168835507002",
  appId: "1:168835507002:web:622a5b66db9107ff7ba603",
  measurementId: "G-0ZTES9PGBV"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };
