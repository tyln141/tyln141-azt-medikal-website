"use client";

import { createElement } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import InfoCardsSection from '@/components/sections/InfoCardsSection';
import ProductGridSection from '@/components/sections/ProductGridSection';
import AboutHeroSection from '@/components/sections/AboutHeroSection';
import AboutSection from '@/components/sections/AboutSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import ContactSection from '@/components/sections/ContactSection';
import { useAppContext } from '@/context/AppProvider';

const sectionMap: Record<string, React.FC<any>> = {
    Hero: HeroSection,
    AboutHero: AboutHeroSection,
    About: AboutSection, // New dynamic component
    InfoCards: InfoCardsSection,
    ProductGrid: ProductGridSection,
    WhyUs: WhyUsSection,
    Contact: ContactSection,
};

interface HomeClientProps {
    initialPageData: any[];
    siteContent: any;
}

export default function HomeClient({ initialPageData, siteContent }: HomeClientProps) {
    const { language, products } = useAppContext();
    const safeLanguage = language || 'tr';

    // We prioritize sections from siteContent for About and WhyUs if they exist
    const renderSections = (Array.isArray(initialPageData) ? initialPageData : []).map((section: any, idx: number) => {
        if (!section?.type) return null;
        
        let Component = sectionMap[section.type];
        let content = section.content || {};

        // OVERRIDE: If it's AboutHero or About, we use the new AboutSection with siteContent.about
        if ((section.type === 'AboutHero' || section.type === 'About') && siteContent?.about) {
            Component = AboutSection;
            content = siteContent.about;
            return <div id="about" key={section?.id || idx}><Component content={content} language={safeLanguage} /></div>;
        }

        // OVERRIDE: If it's WhyUs, we use siteContent.whyUs
        if (section.type === 'WhyUs' && siteContent?.whyUs) {
            Component = WhyUsSection;
            content = siteContent.whyUs;
            return <div id="why-us" key={section?.id || idx}><Component content={content} language={safeLanguage} /></div>;
        }

        if (!Component) return null;

        // Support sections that need products data implicitly
        if (section.type === 'ProductGrid') {
            const safeProducts = Array.isArray(products) ? products : [];
            return <Component key={section?.id || idx} content={content} language={safeLanguage} products={safeProducts} />;
        }

        return <Component key={section?.id || idx} content={content} language={safeLanguage} />;
    });

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div>
                    {renderSections}
                </div>
            </main>
        </div>
    );
}
