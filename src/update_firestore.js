import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { readFile } from "fs/promises";

// load JSON manually
const levels = JSON.parse(
    await readFile(new URL("./levels.json", import.meta.url))
);

const firebaseConfig = {
    apiKey: "AIzaSyBMhxQyzcENkFerkc5o2wjuPdkfGOzA2V8",
    authDomain: "openvtt-379ed.firebaseapp.com",
    databaseURL: "https://openvtt-379ed-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "openvtt-379ed",
    storageBucket: "openvtt-379ed.firebasestorage.app",
    messagingSenderId: "463540982608",
    appId: "1:463540982608:web:cc9678add855ae61449255"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importLevels() {
    for (const [levelId, levelData] of Object.entries(levels.levels)) {
        await setDoc(doc(db, "levels", levelId, "map", "map"), levelData.map, { merge: true });

        for (const [tokenId, tokenData] of Object.entries(levelData.tokens)) {
            await setDoc(doc(db, "levels", levelId, "tokens", tokenId), tokenData, { merge: true });
        }
    }
}

importLevels().then(() => console.log("Levels imported ✅"));
