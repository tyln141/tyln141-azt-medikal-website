import Container from '@/components/Container';
import { Language } from '@/lib/i18n';

interface InfoCardsProps {
    content: {
        cards: Array<{
            title: Record<Language, string>;
            desc: Record<Language, string>;
            icon: string;
        }>;
    };
    language: Language;
}

export default function InfoCardsSection({ content, language }: InfoCardsProps) {
    return (
        <section className="py-24 bg-gray-50/50 relative overflow-hidden">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.cards.map((card, i) => (
                        <div key={i} className="bg-white rounded-3xl p-10 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-4xl mb-8">
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-extrabold text-dark mb-4">
                                {card.title[language] || card.title['tr']}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {card.desc[language] || card.desc['tr']}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
