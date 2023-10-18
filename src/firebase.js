import { initializeApp } from "firebase/app";
import {getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLVtRq5k3MkJ22WzmJK-2EU0RP2UbJpJc",
  authDomain: "freelanceisland.firebaseapp.com",
  projectId: "freelanceisland",
  storageBucket: "freelanceisland.appspot.com",
  messagingSenderId: "593818675309",
  appId: "1:593818675309:web:f05fd43368284da7e9f764"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);