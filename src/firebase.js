import { initializeApp } from "firebase/app";
import {getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB6f_NJYgZpVK4Zjk6UlvwM_fMEfcTjE9w",
  authDomain: "phygital-web-services.firebaseapp.com",
  projectId: "phygital-web-services",
  storageBucket: "phygital-web-services.appspot.com",
  messagingSenderId: "942234612433",
  appId: "1:942234612433:web:62cdd531a413579a800bf0"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);