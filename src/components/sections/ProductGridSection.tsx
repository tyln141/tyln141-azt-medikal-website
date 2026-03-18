import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import Link from 'next/link';
import { Language, getTranslation } from '@/lib/i18n';
import { Product } from '@/context/AppProvider';

interface ProductGridProps {
    content: {
        title: Record<Language, string>;
    };
    language: Language;
    products: Product[];
}

export default function ProductGridSection({ content, language, products }: ProductGridProps) {
    const t = getTranslation(language);
    // Show only first 4 products for the grid on homepage
    const featuredProducts = products.slice(0, 4);

    return (
        <section className="py-32 relative">
            <Container>
                <SectionTitle
                    title={content.title[language] || content.title['tr']}
                    center={true}
                    className="mb-20"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded-3xl p-8 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col">
                            <div className="aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center">
                                {product.image ? (
                                    <img 
                                        key={`${product.image}-${Date.now()}`}
                                        src={`${product.image}?t=${Date.now()}`} 
                                        alt={product.name[language] || product.name['tr']} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500 opacity-20">🏥</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-2">
                                {product.name[language] || product.name['tr']}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                                {product.description[language] || product.description['tr']}
                            </p>
                            <Link href={`/products?id=${product.id}`} className="mt-auto text-primary font-bold inline-flex items-center gap-2 group/btn">
                                {t("products.details")} <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/products" className="btn btn-outline px-10 py-4 font-bold border-2 rounded-2xl hover:bg-primary hover:text-white transition-all">
                        {t("products.viewAll")}
                    </Link>
                </div>
            </Container>
        </section>
    );
}
