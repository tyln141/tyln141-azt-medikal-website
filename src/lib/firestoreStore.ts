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
import { Product, SiteSettings } from "../types";

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
            tr: "AZT Medikal, sağlık sektöründe yenilikçi ve güvenilir çözümler sunmak amacıyla kurulmuş, Ankara merkezli bir tıbbi cihaz ve sarf malzeme tedarikçisidir. 2010 yılından bu yana, 'A'dan Z'ye Temin' vizyonuyla, hastaneler ve sağlık kuruluşları için yüksek kaliteli ürünler ve kesintisiz teknik destek sağlamaktayız. Modern tıp teknolojilerini yerel saha tecrübesiyle birleştirerek, sağlık profesyonellerinin her türlü ihtiyacına profesyonel çözümler üretiyoruz. Güvenilirlik, dürüstlük ve hasta odaklılık temel değerlerimizdir.",
            en: "AZT Medical is an Ankara-based medical device and consumable supplier established to provide innovative and reliable solutions in the healthcare sector. Since 2010, with our vision of 'A to Z Provision', we have been providing high-quality products and continuous technical support for hospitals and health institutions. By combining modern medical technologies with local field experience, we produce professional solutions for all types of healthcare professionals' needs. Reliability, integrity and patient orientation are our core values.",
            de: "AZT Medikal ist ein in Ankara ansässiger Anbieter von Medizinprodukten und Verbrauchsmaterialien, der gegründet wurde, um innovative und zuverlässige Lösungen im Gesundheitssektor anzubieten. Seit 2010 bieten wir mit unserer Vision 'A bis Z Beschaffung' qualitativ hochwertige Produkte und kontinuierlichen technischen Support für Krankenhäuser und Gesundheitseinrichtungen an. Durch die Kombination moderner medizinischer Technologien mit lokaler Außendienst-Erfahrung produzieren wir professionelle Lösungen für alle Bedürfnisse des medizinischen Fachpersonals. Zuverlässigkeit, Integrität und Patientenorientierung sind unsere Grundwerte.",
            fr: "AZT Medikal est un fournisseur de dispositifs médicaux et de consommables basé à Ankara, créé pour fournir des solutions innovantes et fiables dans le secteur de la santé. Depuis 2010, fort de notre vision d'Approvisionnement de A à Z', nous fournissons des produits de haute qualité et une assistance technique continue aux hôpitaux et aux établissements de santé. En combinant les technologies médicales modernes avec l'expérience locale sur le terrain, nous produisons des solutions professionnelles pour tous les besoins des professionnels de santé. La fiabilité, l'intégrité et l'orientation patient sont nos valeurs fondamentales."
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
                icon: "🚀",
                title: { tr: "Teknoloji", en: "Technology", de: "Technologie", fr: "Technologie" },
                description: {
                    tr: "En son tıbbi teknolojileri ve inovatif çözümleri sağlık kurumlarına ulaştırıyoruz.",
                    en: "We deliver the latest medical technologies and innovative solutions to health institutions.",
                    de: "Wir liefern die neuesten medizinischen Technologien und innovativen Lösungen an Gesundheitseinrichtungen.",
                    fr: "Nous livrons les dernières technologies médicales et des solutions innovantes aux établissements de santé."
                }
            },
            {
                icon: "🛡️",
                title: { tr: "Güvenilirlik", en: "Reliability", de: "Zuverlässigkeit", fr: "Fiabilité" },
                description: {
                    tr: "Sertifikalı ürünlerimiz ve şeffaf hizmet anlayışımızla sektörde güven inşa ediyoruz.",
                    en: "We build trust in the sector with our certified products and transparent service approach.",
                    de: "Wir bauen Vertrauen in der Branche mit unseren zertifizierten Produkten und unserem transparenten Serviceansatz auf.",
                    fr: "Nous construisons la confiance dans le secteur avec nos produits certifiés et notre approche de service transparente."
                }
            },
            {
                icon: "👨‍⚕️",
                title: { tr: "Uzman Kadro", en: "Expert Team", de: "Expertenteam", fr: "Équipe experte" },
                description: {
                    tr: "Alanında uzman teknik ekibimizle profesyonel danışmanlık ve destek sağlıyoruz.",
                    en: "We provide professional consultancy and support with our expert technical team.",
                    de: "Wir bieten professionelle Beratung und Unterstützung mit unserem kompetenten technischen Team.",
                    fr: "Nous fournissons des conseils et un soutien professionnels avec notre équipe technique d'experts."
                }
            },
            {
                icon: "⚡",
                title: { tr: "Hızlı Hizmet", en: "Fast Service", de: "Schneller Service", fr: "Service rapide" },
                description: {
                    tr: "Güçlü lojistik ağımız sayesinde ihtiyaçlarınıza en hızlı şekilde yanıt veriyoruz.",
                    en: "Thanks to our strong logistics network, we respond to your needs in the fastest way.",
                    de: "Dank unseres starken Logistiknetzwerks reagieren wir auf Ihre Bedürfnisse auf dem schnellsten Weg.",
                    fr: "Grâce à notre solide réseau logistique, nous répondons à vos besoins de la manière la plus rapide."
                }
            }
        ]
    }
};

export const DEFAULT_CATEGORIES = [
    {
        id: "cerrahi",
        name: { tr: "Cerrahi Ürünler", en: "Surgical Products", de: "Chirurgische Produkte", fr: "Produits chirurgicaux" }
    },
    {
        id: "enfeksiyon",
        name: { tr: "Enfeksiyon Kontrol", en: "Infection Control", de: "Infektionskontrolle", fr: "Contrôle des infections" }
    },
    {
        id: "ekipman",
        name: { tr: "Hastane Ekipmanları", en: "Hospital Equipment", de: "Krankenhausausstattung", fr: "Équipement hospitalier" }
    },
    {
        id: "sarf",
        name: { tr: "Medikal Sarf", en: "Medical Consumables", de: "Medizinische Verbrauchsmaterialien", fr: "Consommables médicaux" }
    }
];

export const DEFAULT_PRODUCTS: Product[] = [
    {
        id: "p-1",
        name: { tr: "Antimikrobiyal Cerrahi Eldiven", en: "Antimicrobial Surgical Glove", de: "Antimikrobieller chirurgischer Handschuh", fr: "Gant chirurgical antimicrobien" },
        category: "cerrahi",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80\u0026w=1000",
        description: { 
            tr: "Yüksek koruma sağlayan, antimikrobiyal özellikli steril cerrahi eldiven.", 
            en: "Sterile surgical glove with antimicrobial properties providing high protection.", 
            de: "Steriler chirurgischer Handschuh mit antimikrobiellen Eigenschaften für hohen Schutz.", 
            fr: "Gant chirurgical stérile aux propriétés antimicrobiennes offrant une protection élevée." 
        },
        technicalSpecs: {
            tr: ["Lateks içermez", "Hipoalerjenik", "AQL 0.65 seviyesi"],
            en: ["Latex free", "Hypoallergenic", "AQL 0.65 level"],
            de: ["Latexfrei", "Hypoallergen", "AQL 0,65-Niveau"],
            fr: ["Sans latex", "Hypoallergénique", "Niveau AQL 0,65"]
        },
        usageAreas: {
            tr: ["Genel Cerrahi", "Ortopedi", "Kontamine vakalar"],
            en: ["General Surgery", "Orthopedics", "Contaminated cases"],
            de: ["Allgemeine Chirurgie", "Orthopädie", "Kontaminierte Fälle"],
            fr: ["Chirurgie Générale", "Orthopédie", "Cas contaminés"]
        },
        advantages: {
            tr: ["Çapraz kontaminasyon riskini azaltır", "Mükemmel tutuş sağlar"],
            en: ["Reduces cross-contamination risk", "Provides excellent grip"],
            de: ["Reduziert das Risiko einer Kreuzkontamination", "Bietet hervorragenden Grip"],
            fr: ["Réduit le risque de contamination croisée", "Offre une excellente adhérence"]
        },
        safetyStandards: {
            tr: ["EN 455", "ASTM D3577", "CE Belgeli"],
            en: ["EN 455", "ASTM D3577", "CE Certified"],
            de: ["EN 455", "ASTM D3577", "CE-zertifiziert"],
            fr: ["EN 455", "ASTM D3577", "Certifié CE"]
        }
    },
    {
        id: "p-2",
        name: { tr: "İnfüzyon Pompası", en: "Infusion Pump", de: "Infusionspumpe", fr: "Pompe à perfusion" },
        category: "ekipman",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80\u0026w=1000",
        description: { 
            tr: "Hassas dozajlama sağlayan akıllı infüzyon sistemi.", 
            en: "Intelligent infusion system providing precise dosing.", 
            de: "Intelligentes Infusionssystem für präzise Dosierung.", 
            fr: "Système de perfusion intelligent offrant un dosage précis." 
        },
        technicalSpecs: {
            tr: ["0.1-1200 ml/h akış hızı", "Dahili batarya (8 saat)", "Wi-Fi bağlantısı"],
            en: ["0.1-1200 ml/h flow rate", "Internal battery (8 hours)", "Wi-Fi connectivity"],
            de: ["0,1-1200 ml/h Durchflussrate", "Interne Batterie (8 Stunden)", "Wi-Fi-Konnektivität"],
            fr: ["Débit de 0,1 à 1200 ml/h", "Batterie interne (8 heures)", "Connectivité Wi-Fi"]
        },
        usageAreas: {
            tr: ["Yoğun Bakım", "Onkoloji", "Acil Servis"],
            en: ["Intensive Care", "Oncology", "Emergency Room"],
            de: ["Intensivstation", "Onkologie", "Notaufnahme"],
            fr: ["Soins Intensifs", "Oncologie", "Urgences"]
        },
        advantages: {
            tr: ["Hata payını en aza indirir", "Kolay arayüz"],
            en: ["Minimizes margin of error", "Easy interface"],
            de: ["Minimiert die Fehlerquote", "Einfache Benutzeroberfläche"],
            fr: ["Minimise la marge d'erreur", "Interface facile"]
        },
        safetyStandards: {
            tr: ["IEC 60601-1", "ISO 13485"],
            en: ["IEC 60601-1", "ISO 13485"],
            de: ["IEC 60601-1", "ISO 13485"],
            fr: ["IEC 60601-1", "ISO 13485"]
        }
    },
    {
        id: "p-3",
        name: { tr: "Steril Enjektör", en: "Sterile Syringe", de: "Sterile Spritze", fr: "Seringue stérile" },
        category: "sarf",
        image: "https://images.unsplash.com/photo-1583947581924-860bda3a36df?q=80\u0026w=1000",
        description: { 
            tr: "3 parçalı, luer-lock uçlu, non-pirojenik steril enjektör.", 
            en: "3-part, luer-lock tip, non-pyrogenic sterile syringe.", 
            de: "3-teilige sterile Spritze mit Luer-Lock-Spitze, nicht pyrogen.", 
            fr: "Seringue stérile en 3 parties, embout luer-lock, non pyrogène." 
        },
        technicalSpecs: {
            tr: ["Hacim: 2ml, 5ml, 10ml", "Polipropilen gövde", "Lateks conta"],
            en: ["Volume: 2ml, 5ml, 10ml", "Polypropylene body", "Latex gasket"],
            de: ["Volumen: 2ml, 5ml, 10ml", "Polypropylen-Körper", "Latexdichtung"],
            fr: ["Volume : 2 ml, 5 ml, 10 ml", "Corps en polypropylène", "Joint en latex"]
        },
        usageAreas: {
            tr: ["Enjeksiyonlar", "Kan alımı", "İlaç hazırlama"],
            en: ["Injections", "Blood collection", "Drug preparation"],
            de: ["Injektionen", "Blutentnahme", "Arzneimittelherstellung"],
            fr: ["Injections", "Prélèvement sanguin", "Préparation de médicaments"]
        },
        advantages: {
            tr: ["Sızdırmazlık garantili", "Kolay okunabilir ölçek"],
            en: ["Sealing guaranteed", "Easy to read scale"],
            de: ["Versiegelung garantiert", "Leicht lesbare Skala"],
            fr: ["Étanchéité garantie", "Échelle facile à lire"]
        },
        safetyStandards: {
            tr: ["ISO 7886-1", "CE"],
            en: ["ISO 7886-1", "CE"],
            de: ["ISO 7886-1", "CE"],
            fr: ["ISO 7886-1", "CE"]
        }
    },
    {
        id: "p-4",
        name: { tr: "Diyaliz Seti", en: "Dialysis Set", de: "Dialyse-Set", fr: "Kit de dialyse" },
        category: "enfeksiyon",
        image: "https://images.unsplash.com/photo-1579154341098-e027f1ca8131?q=80\u0026w=1000",
        description: { 
            tr: "Hemodiyaliz tedavisi için arteriyovenöz kan hattı seti.", 
            en: "Arteriovenous blood line set for hemodialysis treatment.", 
            de: "Arteriovenöses Blutleitungssystem für die Hämodialysebehandlung.", 
            fr: "Kit de ligne sanguine artérioveineuse pour traitement d'hémodialyse." 
        },
        technicalSpecs: {
            tr: ["DEHP içermez", "Gama steril", "Tüm cihazlarla uyumlu"],
            en: ["DEHP free", "Gamma sterile", "Compatible with all devices"],
            de: ["DEHP-frei", "Gammasteril", "Kompatibel mit allen Geräten"],
            fr: ["Sans DEHP", "Stérile Gamma", "Compatible avec tous les appareils"]
        },
        usageAreas: {
            tr: ["Diyaliz Merkezleri", "Nefroloji Bölümleri"],
            en: ["Dialysis Centers", "Nephrology Departments"],
            de: ["Dialysezentren", "Nephrologische Abteilungen"],
            fr: ["Centres de Dialyse", "Services de Néphrologie"]
        },
        advantages: {
            tr: ["Biyouyumlu malzeme", "Hava tuzağı sistemi"],
            en: ["Biocompatible material", "Air trap system"],
            de: ["Biokompatibles Material", "Luftfallensystem"],
            fr: ["Matériau biocompatible", "Système de piège à air"]
        },
        safetyStandards: {
            tr: ["ISO 8637-2"],
            en: ["ISO 8637-2"],
            de: ["ISO 8637-2"],
            fr: ["ISO 8637-2"]
        }
    },
    {
        id: "p-5",
        name: { tr: "Port Kateter", en: "Port Catheter", de: "Portkatheter", fr: "Cathéter à chambre" },
        category: "cerrahi",
        image: "https://images.unsplash.com/photo-1576091160550-2173dad99978?q=80\u0026w=1000",
        description: { 
            tr: "Uzun süreli vasküler erişim için titanyum/polisülfon port sistemi.", 
            en: "Titanium/polysulfone port system for long-term vascular access.", 
            de: "Titan/Polysulfon-Portsystem für den langfristigen Gefäßzugang.", 
            fr: "Système de chambre en titane/polysulfone pour accès vasculaire longue durée." 
        },
        technicalSpecs: {
            tr: ["MRI uyumlu", "Yüksek basınç dayanımı", "Silikon septumlu"],
            en: ["MRI compatible", "High pressure resistance", "With silicone septum"],
            de: ["MRT-kompatibel", "Hohe Druckfestigkeit", "Mit Silikonseptum"],
            fr: ["Compatible IRM", "Haute résistance à la pression", "Avec septum en silicone"]
        },
        usageAreas: {
            tr: ["Kemoterapi", "Parenteral Beslenme", "Antibiyotik tedavisi"],
            en: ["Chemotherapy", "Parenteral Nutrition", "Antibiotic therapy"],
            de: ["Chemotherapie", "Parenterale Ernährung", "Antibiotikatherapie"],
            fr: ["Chimiothérapie", "Nutrition parentérale", "Antibiorésistance"]
        },
        advantages: {
            tr: ["Hasta konforunu artırır", "Enfeksiyon riskini azaltır"],
            en: ["Increases patient comfort", "Reduces infection risk"],
            de: ["Erhöht den Patientenkomfort", "Reduziert das Infektionsrisiko"],
            fr: ["Augmente le confort du patient", "Réduit le risque d'infection"]
        },
        safetyStandards: {
            tr: ["ISO 10555", "CE 0123"],
            en: ["ISO 10555", "CE 0123"],
            de: ["ISO 10555", "CE 0123"],
            fr: ["ISO 10555", "CE 0123"]
        }
    },
    {
        id: "p-6",
        name: { tr: "Serum Seti", en: "Infusion Set", de: "Infusionsset", fr: "Set de perfusion" },
        category: "sarf",
        image: "https://images.unsplash.com/photo-1631217816660-ad54cf89966d?q=80\u0026w=1000",
        description: { 
            tr: "Hassas akış kontrollü, 15 mikron filtreli infüzyon seti.", 
            en: "Infusion set with precise flow control and 15 micron filter.", 
            de: "Infusionsset mit präziser Durchflusskontrolle und 15-Mikron-Filter.", 
            fr: "Set de perfusion avec contrôle précis du débit et filtre de 15 microns." 
        },
        technicalSpecs: {
            tr: ["20 damla/ml", "Luer-lock konnektör", "150 cm hortum"],
            en: ["20 drops/ml", "Luer-lock connector", "150 cm tube"],
            de: ["20 Tropfen/ml", "Luer-Lock-Anschluss", "150 cm Schlauch"],
            fr: ["20 gouttes/ml", "Connecteur luer-lock", "Tuyau de 150 cm"]
        },
        usageAreas: {
            tr: ["Sıvı tedavisi", "İlaç uygulamaları"],
            en: ["Fluid therapy", "Drug applications"],
            de: ["Flüssigkeitstherapie", "Arzneimittelanwendungen"],
            fr: ["Fluidothérapie", "Applications médicamenteuses"]
        },
        advantages: {
            tr: ["Hassas hız ayarı", "Hava kabarcığı önleme"],
            en: ["Precise rate adjustment", "Air bubble prevention"],
            de: ["Präzise RAT-Einstellung", "Luftblasenvorbeugung"],
            fr: ["Réglage précis du débit", "Prévention des bulles d'air"]
        },
        safetyStandards: {
            tr: ["ISO 8536-4"],
            en: ["ISO 8536-4"],
            de: ["ISO 8536-4"],
            fr: ["ISO 8536-4"]
        }
    }
];
