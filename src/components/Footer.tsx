"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useAppContext } from '@/context/AppProvider';

export default function Footer() {
  const { t, language } = useAppContext();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/content')
      .then(r => r.json())
      .then(data => {
        if (data.footer && data.footer[0]) {
          setContent(data.footer[0].content);
        }
      })
      .catch(e => console.error("Failed to fetch footer content", e));
  }, []);

  const footerDesc = content?.description?.[language] || t("footer.desc");
  const poweredBy = content?.poweredBy || "LeverPlay";

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

          <div className="flex flex-col gap-6 lg:col-span-1">
            <Logo />
            <p className="text-gray-500 text-sm leading-relaxed mb-4 whitespace-pre-line">
              {footerDesc}
            </p>
          </div>

          <div>
            <h4 className="text-dark font-extrabold text-lg mb-8 relative inline-block tracking-tight">
              {t("footer.sitemap")}
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("nav.home")}</Link></li>
              <li><Link href="/products" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("nav.products")}</Link></li>
              <li><Link href="/#about" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("nav.about")}</Link></li>
              <li><Link href="/contact" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark font-extrabold text-lg mb-8 relative inline-block tracking-tight">
              {t("footer.popularProducts")}
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/products?category=cerrahi" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("categories.cerrahi")}</Link></li>
              <li><Link href="/products?category=enfeksiyon" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("categories.enfeksiyon")}</Link></li>
              <li><Link href="/products?category=ekipman" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("categories.ekipman")}</Link></li>
              <li><Link href="/products?category=sarf" className="text-gray-500 font-medium hover:text-primary transition-colors hover:pl-2 inline-block transform">{t("categories.sarf")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark font-extrabold text-lg mb-8 relative inline-block tracking-tight">
              {t("contact.title")}
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 items-start group">
                <span className="w-10 h-10 rounded-xl bg-gray-50 text-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">📍</span>
                <span className="text-gray-500 text-sm font-medium mt-1 leading-relaxed">{t("contact.addressText")}</span>
              </li>
              <li className="flex gap-4 items-center group">
                <span className="w-10 h-10 rounded-xl bg-gray-50 text-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">📞</span>
                <span className="text-gray-500 text-sm font-bold tracking-wider">{t("contact.phoneText")}</span>
              </li>
              <li className="flex gap-4 items-center group">
                <span className="w-10 h-10 rounded-xl bg-gray-50 text-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">✉️</span>
                <span className="text-gray-500 text-sm font-medium">{t("contact.emailText")}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} AZT Medikal. {t("footer.rights")}
          </p>
          <div className="md:ml-auto">
            <a 
              href="https://leverplay.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-handwriting text-primary/70 hover:text-primary transition-opacity duration-300 text-sm"
              title={`Powered By ${content?.poweredBy || "LeverPlay"}`}
            >
              Powered By: <span className="italic font-bold tracking-tight">{content?.poweredBy || "LeverPlay"}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
