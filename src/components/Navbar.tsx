"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useAppContext } from '@/context/AppProvider';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
        ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'py-6 bg-transparent'
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center justify-center gap-10">
            <Link href="/" className="text-dark font-bold hover:text-primary transition-all hover:-translate-y-1 block tracking-wide">{t("nav.home")}</Link>
            <Link href="/#about" className="text-dark font-bold hover:text-primary transition-all hover:-translate-y-1 block tracking-wide">{t("nav.about")}</Link>
            <Link href="/products" className="text-dark font-bold hover:text-primary transition-all hover:-translate-y-1 block tracking-wide">{t("nav.products")}</Link>
            <Link href="/#why-us" className="text-dark font-bold hover:text-primary transition-all hover:-translate-y-1 block tracking-wide">{t("nav.why_us")}</Link>
            <Link href="/contact" className="text-dark font-bold hover:text-primary transition-all hover:-translate-y-1 block tracking-wide">{t("nav.contact")}</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
          </div>

          <button
            className="md:hidden p-2 text-dark hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px] py-6' : 'max-h-0 py-0 border-opacity-0'
        }`}>
        <div className="flex flex-col px-6 gap-6">
          <Link href="/" className="text-dark text-xl font-bold hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t("nav.home")}</Link>
          <Link href="/#about" className="text-dark text-xl font-bold hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t("nav.about")}</Link>
          <Link href="/products" className="text-dark text-xl font-bold hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t("nav.products")}</Link>
          <Link href="/#why-us" className="text-dark text-xl font-bold hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t("nav.why_us")}</Link>
          <Link href="/contact" className="text-dark text-xl font-bold hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t("nav.contact")}</Link>
          <div className="flex items-center justify-center pt-6 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
