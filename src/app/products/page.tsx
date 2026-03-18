"use client";

import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
