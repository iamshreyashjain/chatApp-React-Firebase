// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import {getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAgcqDswepf8wSncJox_w9wX2OX2Mejxw",
  authDomain: "learner-dc009.firebaseapp.com",
  projectId: "learner-dc009",
  storageBucket: "learner-dc009.appspot.com",
  messagingSenderId: "215967958133",
  appId: "1:215967958133:web:beaf43911664a06850a43c",
  databaseURL: 'https://learner-dc009-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)