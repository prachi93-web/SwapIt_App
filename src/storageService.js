import { getStorage, ref, uploadBytes } from "firebase/storage";
import app from "./firebaseConfig";

// Get Storage instance
const storage = getStorage(app);

// Function to Upload a File
export const uploadFile = async (file) => {
    try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        return uploadResult.metadata.fullPath;
    } catch (error) {
        console.error("Error uploading file:", error.message);
        throw error;
    }
};
