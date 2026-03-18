"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppProvider';
import WhyUsSection from '@/components/sections/WhyUsSection';

export default function WhyUsPage() {
    const { language } = useAppContext();
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/pages')
            .then(r => r.json())
            .then(data => {
                if (data['why-us']) {
                    setSections(data['why-us']);
                }
                setLoading(false);
            })
            .catch(e => {
                console.error("Failed to fetch why-us page", e);
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
                    case 'WhyUs':
                        return <WhyUsSection key={section.id} content={section.content} language={language} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
