// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Corrected import
import { getStorage} from "firebase/storage"; // عشان الصور 
import { getFirestore} from "firebase/firestore"; // عشان الصور 


const firebaseConfig = {
  apiKey: "AIzaSyBqvww-jWVffitI23QrD5H7m654-c-ZRmI",
  authDomain: "chat1-9d109.firebaseapp.com",
  projectId: "chat1-9d109",
  storageBucket: "chat1-9d109.appspot.com",
  messagingSenderId: "586285973749",
  appId: "1:586285973749:web:2a3fb32bcad6a2473945bc",
  measurementId: "G-W3RDPLG0W9"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db=getFirestore()
