import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDn4HvtP5XzsuFAXSyrkmQEuN4T3ap1Lbg",
    authDomain: "time-card-system.firebaseapp.com",
    databaseURL: "https://time-card-system.firebaseio.com",
    projectId: "time-card-system",
    storageBucket: "time-card-system.appspot.com",
    messagingSenderId: "53212561447",
    appId: "1:53212561447:web:4e367157649a3f69548e02",
    measurementId: "G-3X2LJMLKPG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({timestampsInSnapshots: true})
export default firebase

//   firebase.analytics();