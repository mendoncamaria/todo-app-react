// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTnCoSMU9-7R2ng4ab-W0xf4Cu7MGFCt4",
  authDomain: "todo-app-7f768.firebaseapp.com",
  projectId: "todo-app-7f768",
  storageBucket: "todo-app-7f768.appspot.com",
  messagingSenderId: "826062630365",
  appId: "1:826062630365:web:690ed7440c06bb0b4f1a34",
  measurementId: "G-0H066095MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app)