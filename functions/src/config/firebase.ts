import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: "AIzaSyAM1X7-W7n0hoJsvujRNN_GIZRriN1SwkI",
  authDomain: "fluencizap.firebaseapp.com",
  projectId: "fluencizap",
  storageBucket: "fluencizap.firebasestorage.app",
  messagingSenderId: "236240193417",
  appId: "1:236240193417:web:215a8bca1dbb1c37e24358",
  measurementId: "G-LXNLNVQJ08"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage, firebaseConfig };
