import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAM1X7-W7n0hoJsvujRNN_GIZRriN1SwkI",
  authDomain: "fluencizap.firebaseapp.com",
  projectId: "fluencizap",
  storageBucket: "fluencizap.firebasestorage.app",
  messagingSenderId: "236240193417",
  appId: "1:236240193417:web:215a8bca1dbb1c37e24358",
  measurementId: "G-LXNLNVQJ08"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
