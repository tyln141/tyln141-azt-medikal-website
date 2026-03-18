"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Product, useAppContext } from '@/context/AppProvider';
import { getValue } from '@/lib/i18n';

export default function ProductCard({ product }: { product: Product }) {
    const { language, t } = useAppContext();

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-1">
                {/* Image Wrapper */}
                <div className="relative aspect-video w-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 z-10" />

                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={getValue(product.name, language)}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-200">
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">🏥</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {t("categories." + String(product.category)) || product.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {getValue(product.name, language)}
                    </h3>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                        {getValue(product.description, language)}
                    </p>

                    {/* Footer of Card */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            {t("products.details")} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-primary flex items-center justify-center transition-colors">
                            <span className="text-gray-400 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
