// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMhxQyzcENkFerkc5o2wjuPdkfGOzA2V8",
    authDomain: "openvtt-379ed.firebaseapp.com",
    projectId: "openvtt-379ed",
    storageBucket: "openvtt-379ed.firebasestorage.app",
    messagingSenderId: "463540982608",
    appId: "1:463540982608:web:cc9678add855ae61449255",
    databaseURL: "https://openvtt-379ed-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
