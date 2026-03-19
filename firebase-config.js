// Firebase конфигурација за Николу Гаћешу
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChwoEz9uKhj8FIONC_ms1syqGx_bQkc0A",
  authDomain: "nikola-gacesa-gallery.firebaseapp.com",
  projectId: "nikola-gacesa-gallery",
  storageBucket: "nikola-gacesa-gallery.firebasestorage.app",
  messagingSenderId: "813005317066",
  appId: "1:813005317066:web:41c202273b851e42b16533",
  measurementId: "G-9EZ8P096PK"
};

// Иницијализација Firebase-а
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };