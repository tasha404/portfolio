import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHvzDaps9HjINEHMK2GQzhCjdiL2IyJVU",
  authDomain: "portfolio-a1010.firebaseapp.com",
  projectId: "portfolio-a1010",
  storageBucket: "portfolio-a1010.firebasestorage.app",
  messagingSenderId: "556428389745",
  appId: "1:556428389745:web:28a37f4b9fb929917c9ad0",
  measurementId: "G-3GR1X8ZY07"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);