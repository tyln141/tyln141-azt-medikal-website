"use client";

import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import { Language } from '@/lib/i18n';

interface WhyUsProps {
    content: any;
    language: Language;
}

export default function WhyUsSection({ content, language }: WhyUsProps) {
    if (!content) return null;

    const lang = language || 'tr';
    const { title = {}, items = [] } = content || {};

    const getText = (textObj: any) => textObj?.[lang] || textObj?.['tr'] || "";

    return (
        <section className="py-32 bg-gray-50/50 overflow-hidden">
            <Container>
                <div className="text-center mb-20 animate-fade-in">
                    <SectionTitle
                        title={getText(title)}
                        subtitle={lang === 'tr' ? "Neden Biz?" : (lang === 'en' ? "Why Us?" : "Why Us?")}
                        center={true}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(Array.isArray(items) ? items : []).map((item, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group relative flex flex-col items-center text-center animate-fade-in-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform shadow-sm relative z-10 overflow-hidden">
                                {item?.icon && typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                                    <img src={item.icon || "/placeholder.png"} alt="" className="w-12 h-12 object-contain" />
                                ) : (
                                    <span>{item?.icon || "⭐"}</span>
                                )}
                            </div>
                            
                            <h4 className="text-2xl font-black text-dark mb-4 tracking-tight relative z-10">
                                {getText(item?.title)}
                            </h4>
                            <p className="text-gray-500 text-base leading-relaxed font-medium relative z-10">
                                {getText(item?.description)}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
