import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuhcFTdEsCgXyVHJeWyqXvi_mtxs3OUOg",
  appId: "1:253041357697:web:e7ac6b9b169be37bfb6e80",
  authDomain: "simple-calorie-app-0.firebaseapp.com",
  measurementId: "G-TE1MW2DGME",
  messagingSenderId: "253041357697",
  projectId: "simple-calorie-app-0",
  storageBucket: "simple-calorie-app-0.appspot.com",
};

// Initialize Firebase
export function initFirebase() {
  initializeApp(firebaseConfig);
}
