"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppProvider';

export default function ProductsPageContent() {
    const { t, products } = useAppContext();
    const searchParams = useSearchParams();
    const initialCategory = searchParams?.get('category') || 'all';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);

    useEffect(() => {
        const loadCats = async () => {
            try {
                const res = await fetch('/api/data/categories');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDynamicCategories([{ id: 'all', name: { tr: t("products.title"), en: 'All Products', de: 'Alle Produkte', fr: 'Tous les produits' } }, ...data]);
                }
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        };
        loadCats();
    }, [t]);

    const safeProducts = Array.isArray(products) ? products : [];
    const filteredProducts = activeCategory === 'all'
        ? safeProducts
        : safeProducts.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50/30 pt-32 pb-24">
            <Container>
                {/* 2. REMOVE “ÜRÜNLERİMİZ” TITLE (PRODUCT PAGE) completely removed SectionTitle */}
                
                <div className="flex flex-wrap pb-4 mb-16 gap-3 justify-center">
                    {dynamicCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-8 py-3.5 rounded-full font-bold transition-all shadow-sm ${activeCategory === cat.id
                                ? 'bg-primary text-white shadow-primary/20 scale-105'
                                : 'bg-white border border-gray-100 text-gray-500 hover:border-primary hover:text-primary hover:shadow-md'
                                }`}
                        >
                            {cat.id === 'all' ? t("products.title") : (cat.name?.tr || cat.id)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-300">
                        <span className="text-6xl text-gray-200 mb-6 block">📂</span>
                        <h3 className="text-3xl font-extrabold text-dark mb-4">{t("products.notFound")}</h3>
                        <button
                            onClick={() => setActiveCategory('all')}
                            className="btn btn-primary mt-4"
                        >
                            {t("nav.products")}
                        </button>
                    </div>
                )}
            </Container>
        </div>
    );
}
