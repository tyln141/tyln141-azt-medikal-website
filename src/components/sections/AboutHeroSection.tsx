"use client";

import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import { Language } from '@/lib/i18n';

interface AboutHeroProps {
    content: any;
    language: Language;
}

export default function AboutHeroSection({ content, language }: AboutHeroProps) {
    if (!content) return null;

    const {
        title = {},
        subtitle = {},
        description = {},
        stats = []
    } = content || {};

    const safeLanguage = language || 'tr';

    return (
        <div className="min-h-screen pt-40 pb-32 bg-gray-50/50">
            <Container>
                <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-12 md:p-24 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">

                    <SectionTitle
                        title={title?.[safeLanguage] || title?.['tr'] || ''}
                        subtitle={subtitle?.[safeLanguage] || subtitle?.['tr'] || ''}
                        className="mb-12 relative z-10"
                        center={true}
                    />

                    <div className="text-center relative z-10 space-y-12">
                        <p className="text-2xl md:text-3xl leading-relaxed text-dark font-medium px-4 md:px-12">
                            {description?.[safeLanguage] || description?.['tr'] || ''}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-100 mt-16">
                            {(Array.isArray(stats) ? stats : []).map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl mb-6 shadow-sm">
                                        {stat?.icon || "⭐"}
                                    </div>
                                    <h4 className="text-4xl font-extrabold text-dark tracking-tight mb-2">
                                        {stat?.value || "0"}
                                    </h4>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
                                        {stat?.label?.[safeLanguage] || stat?.label?.['tr'] || ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}