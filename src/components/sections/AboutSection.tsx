"use client";

import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import { Language } from '@/lib/i18n';

interface AboutSectionProps {
    content: any;
    language: Language;
}

export default function AboutSection({ content, language }: AboutSectionProps) {
    if (!content) return null;

    const lang = language || 'tr';

    const {
        title = {},
        description = {},
        stats = [],
        image = ""
    } = content || {};

    const getText = (textObj: any) => textObj?.[lang] || textObj?.['tr'] || "";

    return (
        <section id="why-us" className="py-32 bg-gray-50/50 overflow-hidden">
            <Container>
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    {/* LEFT: TITLE + DESCRIPTION */}
                    <div className="lg:w-1/2 space-y-8 animate-fade-in-left">
                        <SectionTitle
                            title={getText(title)}
                            subtitle={lang === 'tr' ? "Hakkımızda" : (lang === 'en' ? "About Us" : "About Us")}
                            center={false}
                        />
                        <p className="text-xl leading-relaxed text-gray-600 font-medium">
                            {getText(description)}
                        </p>
                    </div>

                    {/* RIGHT: IMAGE */}
                    <div className="lg:w-1/2 relative animate-fade-in-right flex justify-center">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl opacity-50" />
                        
                        <div 
                            className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border-8 border-white group transition-all duration-500"
                            style={{
                                width: content.imageWidth ? (content.imageWidth.includes('%') || content.imageWidth.includes('px') ? content.imageWidth : `${content.imageWidth}px`) : '100%',
                                height: content.imageHeight ? (content.imageHeight.includes('%') || content.imageHeight.includes('px') ? content.imageHeight : `${content.imageHeight}px`) : '500px',
                                maxWidth: '100%'
                            }}
                        >
                            <img 
                                src={image || "/placeholder.png"} 
                                alt="About AZT Medikal" 
                                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    objectFit: (content.imageFit as any) || 'cover',
                                    objectPosition: (content.imagePosition as any) || 'center'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* BOTTOM: STATS */}
                <div className="mt-24 pt-20 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in-up">
                    {(Array.isArray(stats) ? stats : []).map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-100">
                            <h4 className="text-5xl font-black text-primary mb-3 tracking-tighter">
                                {stat?.value || "0"}
                            </h4>
                            <p className="text-dark font-bold uppercase tracking-widest text-sm">
                                {getText(stat?.label)}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
