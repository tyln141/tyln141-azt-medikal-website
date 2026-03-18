import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    query, 
    deleteDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Reads a single document from a collection.
 * Returns defaultValue if document doesn't exist.
 */
export async function readDoc(col: string, id: string, defaultValue: any = {}) {
    try {
        const docRef = doc(db, col, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading doc ${col}/${id}:`, error);
        return defaultValue;
    }
}

/**
 * Writes a single document to a collection.
 */
export async function writeDoc(col: string, id: string, data: any) {
    try {
        console.log("WRITING TO FIRESTORE:", col, id, data);

        const docRef = doc(db, col, id);
        await setDoc(docRef, data, { merge: true });

        console.log("WRITE SUCCESS");

        return true;
    } catch (error) {
        console.error("WRITE FAILED:", error);
        throw error; // IMPORTANT: do not swallow error
    }
}

/**
 * Reads an entire collection as an array of objects.
 * Each object includes an 'id' field from the document ID.
 */
export async function readCollection(col: string) {
    try {
        const colRef = collection(db, col);
        const querySnapshot = await getDocs(colRef);
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error(`Error reading collection ${col}:`, error);
        return [];
    }
}

/**
 * Writes multiple documents to a collection (overwrite).
 * Used when migrating or updating an entire list (like categories).
 */
export async function writeCollection(col: string, data: any[]) {
    try {
        console.log("WRITING COLLECTION TO FIRESTORE:", col, data.length, "items");
        const promises = data.map(item => {
            if (!item.id) return Promise.resolve();
            const { id, ...rest } = item;
            return setDoc(doc(db, col, id), rest);
        });
        await Promise.all(promises);
        console.log("COLLECTION WRITE SUCCESS");
        return true;
    } catch (error) {
        console.error("COLLECTION WRITE FAILED:", error);
        throw error;
    }
}
