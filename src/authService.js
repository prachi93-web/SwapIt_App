import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// ✅ Signup function with Firestore integration
export const signUp = async (fullName, contactNumber, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Store user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      contactNumber,
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// ✅ Sign-in function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
