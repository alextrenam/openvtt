import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

export function useTokens() {
    const [tokens, setTokens] = useState({});

    useEffect(() => {
	const tokensRef = ref(database, "tokens");

	const unsubscribe = onValue(tokensRef, (snapshot) => {
	    const data = snapshot.val() || {};
	    setTokens(data);
	});

	// Clean up listener on unmount
	return () => unsubscribe();
    }, []);

    return [tokens, setTokens];
}
