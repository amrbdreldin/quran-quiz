// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADxaqifi4GONYMlHvqmdyPzTOy356V2Pg",
  authDomain: "quraan-group.firebaseapp.com",
  projectId: "quraan-group",
  storageBucket: "quraan-group.firebasestorage.app",
  messagingSenderId: "437086622417",
  appId: "1:437086622417:web:fa3c67bb970c9c91212bf0",
  measurementId: "G-GPREH3PKL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);