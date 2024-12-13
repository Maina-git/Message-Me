// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfakAnc_l_7qvu2BPGnyV6h7hIHj3qs_o",
  authDomain: "messageme-bb5b7.firebaseapp.com",
  projectId: "messageme-bb5b7",
  storageBucket: "messageme-bb5b7.firebasestorage.app",
  messagingSenderId: "760093511991",
  appId: "1:760093511991:web:f2a32536fd8b2eaeef8ab2",
  measurementId: "G-LFYXG7F050"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
const analytics = getAnalytics(app);