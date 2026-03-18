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

// --- SEEDING DATA ---

export const DEFAULT_SITE_CONTENT = {
    about: {
        title: {
            tr: "Hakkımızda",
            en: "About Us",
            de: "Über uns",
            fr: "À propos"
        },
        description: {
            tr: "2010'dan beri sağlık çözümleri sunuyoruz.",
            en: "Providing healthcare solutions since 2010.",
            de: "Seit 2010 bieten wir Gesundheitslösungen an.",
            fr: "Nous fournissons des solutions de santé depuis 2010."
        },
        stats: [
            { value: "15+", label: { tr: "Yıl Tecrübe", en: "Years Experience", de: "Jahre Erfahrung", fr: "Années d'expérience" } },
            { value: "500+", label: { tr: "Mutlu Müşteri", en: "Happy Clients", de: "Zufriedene Kunden", fr: "Clients satisfaits" } },
            { value: "1000+", label: { tr: "Ürün", en: "Products", de: "Produkte", fr: "Produits" } }
        ],
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80\u0026w=1000",
        imageWidth: "100%",
        imageHeight: "400px",
        imageFit: "cover",
        imagePosition: "center"
    },
    whyUs: {
        title: {
            tr: "Neden AZT Medikal?",
            en: "Why AZT Medical?",
            de: "Warum AZT Medical?",
            fr: "Pourquoi AZT Medical?"
        },
        items: [
            {
                icon: "⭐",
                title: { tr: "Teknoloji", en: "Technology", de: "Technologie", fr: "Technologie" },
                description: {
                    tr: "Modern çözümler sunuyoruz.",
                    en: "We provide modern solutions.",
                    de: "Wir bieten moderne Lösungen.",
                    fr: "Nous fournissons des solutions modernes."
                }
            },
            {
                icon: "👨‍⚕️",
                title: { tr: "Uzman Kadro", en: "Expert Team", de: "Expertenteam", fr: "Équipe experte" },
                description: {
                    tr: "Deneyimli ekip.",
                    en: "Experienced team.",
                    de: "Erfahrenes Team.",
                    fr: "Équipe expérimentée."
                }
            }
        ]
    }
};

export const DEFAULT_CATEGORIES = [
    {
        id: "medikal",
        name: {
            tr: "Medikal Ürünler",
            en: "Medical Products",
            de: "Medizinische Produkte",
            fr: "Produits médicaux",
            ar: "المنتجات الطبية"
        }
    }
];

export const DEFAULT_PRODUCTS = [
    {
        id: "p-1",
        name: { tr: "Stetoskop", en: "Stethoscope", de: "Stethoskop", fr: "Stéthoscope" },
        description: { 
            tr: "Yüksek hassasiyetli profesyonel stetoskop.", 
            en: "High-precision professional stethoscope.", 
            de: "Hochpräzises professionelles Stethoskop.", 
            fr: "Stéthoscope professionnel de haute précision." 
        },
        category: "medikal",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80\u0026w=1000"
    },
    {
        id: "p-2",
        name: { tr: "Nebülizatör", en: "Nebulizer", de: "Vernebler", fr: "Nébuliseur" },
        description: { 
            tr: "Ev tipi sessiz nebülizatör cihazı.", 
            en: "Home-use silent nebulizer device.", 
            de: "Leises Verneblergerät für den Heimgebrauch.", 
            fr: "Nébuliseur silencieux pour usage domestique." 
        },
        category: "medikal",
        image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa89?q=80\u0026w=1000"
    },
    {
        id: "p-3",
        name: { tr: "Tansiyon Aleti", en: "Blood Pressure Monitor", de: "Blutdruckmessgerät", fr: "Tensiomètre" },
        description: { 
            tr: "Dijital koldan ölçer tansiyon aleti.", 
            en: "Digital arm blood pressure monitor.", 
            de: "Digitales Oberarm-Blutdruckmessgerät.", 
            fr: "Tensiomètre numérique au bras." 
        },
        category: "medikal",
        image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80\u0026w=1000"
    }
];
