import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useTokens(levelId) {
    const [tokens, setTokens] = useState({});

    useEffect(() => {
	if (!levelId) return;

	const tokensCol = collection(db, "levels", levelId, "tokens");
	const unsubscribe = onSnapshot(tokensCol, (snapshot) => {
	    const data = {};
	    snapshot.forEach((docSnap) => {
		data[docSnap.id] = docSnap.data(); // <-- doc.id becomes the key
	    });
	    setTokens(data);
	});

	return () => unsubscribe();
    }, [levelId]);

    return [tokens, setTokens];
}
