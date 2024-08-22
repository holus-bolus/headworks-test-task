

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {

  apiKey: "AIzaSyAk1GGp3SGf8SFbqU0D9V724mrdBfvmMv8",

  authDomain: "todolist-firebase-57bb7.firebaseapp.com",

  projectId: "todolist-firebase-57bb7",

  storageBucket: "todolist-firebase-57bb7.appspot.com",

  messagingSenderId: "434622808194",

  appId: "1:434622808194:web:36e9b010b6318768f7749b",

  measurementId: "G-DEWL6KM0E3"

};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

export { db }
