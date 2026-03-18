import HomeClient from '@/components/sections/HomeClient';

async function getSiteContent() {
    try {
        // We use absolute URL for server-side fetch as required by user
        const res = await fetch("http://localhost:3000/api/site-content", {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error("Site content fetch failed:", e);
        return null;
    }
}

async function getPageData() {
    try {
        const res = await fetch("http://localhost:3000/api/data/content", {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error("Page data fetch failed:", e);
        return null;
    }
}

const FALLBACK_SECTIONS = [
    { 
        id: "hero-1", 
        type: "Hero", 
        content: { 
            title: { 
                tr: "Sağlık Profesyonellerinin Güvenilir Çözüm Ortağı", 
                en: "Reliable Solution Partner for Healthcare Professionals",
                de: "Ihr vertrauenswürdiger Lösungspartner im Gesundheitssektor",
                fr: "Votre partenaire de solutions de confiance dans le secteur de la santé"
            }, 
            subtitle: { 
                tr: "Medikal Tıbbi Malzemeler A'dan Z'ye Temin", 
                en: "Medical Supplies from A to Z",
                de: "Medizinischer Bedarf von A bis Z",
                fr: "Fournitures médicales de A à Z"
            }, 
            buttonText: { 
                tr: "Ürünlerimizi İnceleyin", 
                en: "Explore Our Products",
                de: "Unsere Produkte Entdecken",
                fr: "Découvrez nos produits"
            }, 
            buttonLink: "/products" 
        } 
    },
    { 
        id: "products-1", 
        type: "ProductGrid", 
        content: { 
            title: { 
                tr: "Öne Çıkan Ürünlerimiz", 
                en: "Featured Products",
                de: "Unsere Top-Produkte",
                fr: "Nos Produits Vedettes"
            } 
        } 
    },
    { id: "about-1", type: "About", content: {} },
    { id: "why-us-1", type: "WhyUs", content: {} }
];

export default async function Home() {
    const siteContent = await getSiteContent();
    const pageDataResponse = await getPageData();
    
    let homeSections = FALLBACK_SECTIONS;
    if (pageDataResponse?.home && Array.isArray(pageDataResponse.home) && pageDataResponse.home.length > 0) {
        homeSections = pageDataResponse.home;
    }

    return <HomeClient initialPageData={homeSections} siteContent={siteContent} />;
}
