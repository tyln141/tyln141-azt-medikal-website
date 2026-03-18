"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext, Product } from '@/context/AppProvider';
import QuoteModal from '@/components/QuoteModal';
import { getValue } from '@/lib/i18n';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { products, t, language } = useAppContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
      }
      setLoading(false);
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-12 h-12 border-[5px] border-primary border-t-transparent rounded-full animate-spin shadow-sm"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-4">
        <span className="text-8xl mb-8">⚠️</span>
        <h2 className="text-4xl font-extrabold text-dark mb-6 text-center tracking-tight">
          {t("products.notFound")}
        </h2>
        <button onClick={() => router.push('/products')} className="btn btn-primary px-10 py-4 shadow-xl">
          ← {t("nav.products")}
        </button>
      </div>
    );
  }

  const catKey = String(product.category);

  return (
    <>
      <div className="min-h-screen pt-32 pb-24 bg-gray-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center text-gray-400 hover:text-primary font-bold mb-12 transition-colors uppercase tracking-widest text-sm"
          >
            <span className="mr-3 text-xl group-hover:-translate-x-2 transition-transform">←</span>
            {language === 'tr' ? 'Geri Dön' : (language === 'de' ? 'Zurück' : (language === 'fr' ? 'Retour' : 'Go Back'))}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Image Container */}
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
              <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-white/40 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000 z-0" />

              <div className="relative text-9xl z-10 text-primary/20 drop-shadow-sm group-hover:scale-110 group-hover:text-primary/40 transition-all duration-700">
                ⚕️
              </div>

              <div className="absolute top-8 left-8 z-20">
                <span className="bg-white/90 backdrop-blur-md border border-white/50 text-dark text-xs sm:text-sm font-extrabold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg shadow-primary/5">
                  {t("categories." + String(product.category)) || product.category}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-dark leading-[1.1] tracking-tight mb-8">
                {getValue(product.name, language)}
              </h1>

              <div className="w-24 h-2 bg-gradient-to-r from-primary to-accent rounded-full mb-10 shadow-sm"></div>

                {/* Enhanced Specifications Sections */}
                <div className="pt-10 space-y-12">
                  {/* Technical Specs */}
                  {(product as any).technicalSpecs?.[language] && Array.isArray((product as any).technicalSpecs[language]) && (product as any).technicalSpecs[language].length > 0 && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <h3 className="text-xl font-black text-dark mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm">⚙️</span>
                        {t("product.technicalSpecs")}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(product as any).technicalSpecs[language].map((spec: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Usage Areas */}
                  {(product as any).usageAreas?.[language] && Array.isArray((product as any).usageAreas[language]) && (product as any).usageAreas[language].length > 0 && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <h3 className="text-xl font-black text-dark mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 text-sm">🏥</span>
                        {t("product.usageAreas")}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {(product as any).usageAreas[language].map((area: string, idx: number) => (
                          <span key={idx} className="px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm border border-gray-100">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Advantages */}
                    {(product as any).advantages?.[language] && Array.isArray((product as any).advantages[language]) && (product as any).advantages[language].length > 0 && (
                      <div className="bg-green-50/30 p-8 rounded-3xl border border-green-100/50">
                        <h3 className="text-xl font-black text-green-800 mb-6 flex items-center gap-3">
                          <span className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 text-sm">✅</span>
                          {t("product.advantages")}
                        </h3>
                        <ul className="space-y-4">
                          {(product as any).advantages[language].map((adv: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-green-700 font-medium">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Safety Standards */}
                    {(product as any).safetyStandards?.[language] && Array.isArray((product as any).safetyStandards[language]) && (product as any).safetyStandards[language].length > 0 && (
                      <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                        <h3 className="text-xl font-black text-primary-dark mb-6 flex items-center gap-3">
                          <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm">🛡️</span>
                          {t("product.safetyStandards")}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {(product as any).safetyStandards[language].map((std: string, idx: number) => (
                            <span key={idx} className="px-4 py-2 bg-white text-primary font-black rounded-lg text-xs border border-primary/20 shadow-sm uppercase tracking-widest">
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-16 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 btn btn-primary text-xl py-5 border border-transparent shadow-xl shadow-primary/20 hover:-translate-y-1"
                  >
                    {t("products.requestQuote")}
                  </button>
                  <Link href="/contact" className="sm:w-auto btn btn-outline text-xl py-5 px-10 border-gray-200 text-dark hover:bg-gray-50 bg-white">
                    {t("product.contact")}
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <QuoteModal product={product} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
