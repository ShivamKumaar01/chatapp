
import { initializeApp } from "firebase/app";
import{getFirestore}from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDg9ENWB0IP2WYNOXFGMrDlQV45lFJK-4U",
  authDomain: "chatingapp-c430e.firebaseapp.com",
  projectId: "chatingapp-c430e",
  storageBucket: "chatingapp-c430e.firebasestorage.app",
  messagingSenderId: "871048977459",
  appId: "1:871048977459:web:9829abc37e1eaf289d1746"
};


const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export {db}