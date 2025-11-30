import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDW8JBCj0nFvp6v-4haJGWa8s1qQaenNHA",
  authDomain: "stacademy.firebaseapp.com",
  projectId: "stacademy",
  storageBucket: "stacademy.firebasestorage.app",
  messagingSenderId: "108601632538",
  appId: "1:108601632538:web:c5073de0746074a19b2ea3",
  measurementId: "G-CS7JW8MMR4"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);