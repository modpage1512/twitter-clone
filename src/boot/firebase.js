import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA91mmX51DKPTbqpTheGtWfcSaTze997y0",
  authDomain: "ctwitter-b86f2.firebaseapp.com",
  projectId: "ctwitter-b86f2",
  storageBucket: "ctwitter-b86f2.appspot.com",
  messagingSenderId: "611887455401",
  appId: "1:611887455401:web:d07f233cd15a72d8991db8"
};

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db;