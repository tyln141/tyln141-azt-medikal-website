import Link from 'next/link';
import Container from '@/components/Container';
import { Language } from '@/lib/i18n';

interface HeroProps {
    content: {
        title: Record<Language, string>;
        subtitle: Record<Language, string>;
        buttonText: Record<Language, string>;
        buttonLink: string;
        backgroundImage?: string;
    };
    language: Language;
}

export default function HeroSection({ content, language }: HeroProps) {
    const { 
        title = {} as any, 
        subtitle = {} as any, 
        buttonText = {} as any, 
        buttonLink = '/products', 
        backgroundImage 
    } = content || {};

    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
            <div className="absolute inset-0 bg-white -z-20" />
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 -z-10" />

            {backgroundImage && (
                <div 
                    className="absolute inset-0 opacity-10 -z-15"
                    style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
                />
            )}

            <Container>
                {/* Fixed the layout to be fully centered without the side logo */}
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto z-10 space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-dark leading-[1.1] tracking-tight">
                        {title?.[language] || title?.['tr'] || ''}
                    </h1>

                    <p className="text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        {subtitle?.[language] || subtitle?.['tr'] || ''}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <Link href={buttonLink} className="btn btn-primary px-8 py-5 text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 group">
                            {buttonText?.[language] || buttonText?.['tr'] || ''}
                            <span className="ml-2 transition-transform inline-block group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
