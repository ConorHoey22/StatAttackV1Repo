import firebase from 'firebase/app'

export const firebaseConfig = {
    apiKey: "AIzaSyBneHdUFez0awsDOJRQeamsWVtUJvbEgco",
    authDomain: "statattackdb.firebaseapp.com",
    databaseURL: "https://statattackdb-default-rtdb.firebaseio.com",
    projectId: "statattackdb",
    storageBucket: "statattackdb.appspot.com",
    messagingSenderId: "336146243669",
    appId: "1:336146243669:web:4232f09e1ef3389bf7b4dc",
    measurementId: "G-7TB75Y2J9G"
  };

firebase.initializeApp(firebaseConfig);



export default firebase;