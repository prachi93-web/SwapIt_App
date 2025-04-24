import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebaseConfig";

// Get Firestore instance
const db = getFirestore(app);

// Function to Add a Product
export const addProduct = async (product) => {
    try {
        const docRef = await addDoc(collection(db, "products"), product);
        return docRef.id;
    } catch (error) {
        console.error("Error adding product:", error.message);
        throw error;
    }
};
