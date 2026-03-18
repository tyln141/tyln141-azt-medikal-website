"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppProvider';
import AboutHeroSection from '@/components/sections/AboutHeroSection';

export default function AboutPage() {
    const { language } = useAppContext();
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/data/content')
            .then(r => r.json())
            .then(data => {
                if (data.about) {
                    setSections(data.about);
                }
                setLoading(false);
            })
            .catch(e => {
                console.error("Failed to fetch about page", e);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    return (
        <>
            {sections.map((section: any) => {
                switch (section.type) {
                    case 'AboutHero':
                        return <AboutHeroSection key={section.id} content={section.content} language={language} />;
                    // Add other section types as needed
                    default:
                        return null;
                }
            })}
        </>
    );
}
