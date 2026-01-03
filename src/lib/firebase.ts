import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Replace with your actual Firebase project configuration
// You can find this in your Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyB2aLFiaea3_FdNHY67XgYY2-qYwXGVDDk",
  authDomain: "screenshot-beautifier-ff5c5.firebaseapp.com",
  projectId: "screenshot-beautifier-ff5c5",
  storageBucket: "screenshot-beautifier-ff5c5.firebasestorage.app",
  messagingSenderId: "786525213550",
  appId: "1:786525213550:web:ae85a5955762ba671ae77f"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
