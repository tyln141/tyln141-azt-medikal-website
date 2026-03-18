"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getTranslation, Language } from '@/lib/i18n';
import { Product, SiteSettings, ThemeSettings } from '@/types';

export type { Product };

interface AppContextType {
    products: Product[];
    language: Language;
    setLanguage: (lang: Language) => void;
    addProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    updateProducts: (products: Product[]) => void;
    t: ReturnType<typeof getTranslation>;
    siteSettings: SiteSettings;
    updateSiteSettings: (settings: SiteSettings) => void;
    theme: ThemeSettings;
    updateTheme: (theme: ThemeSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [language, setLanguageState] = useState<Language>('tr');
    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        contactEmail: '',
        contactPhone: '',
        address: '',
        workingHours: '',
        footerCredit: '',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        headerLayout: 'standard',
        footerText: '',
        poweredBy: 'LeverPlay'
    });
    const [theme, setTheme] = useState<ThemeSettings>({
        primaryColor: '#0EA5E9',
        backgroundColor: '#F8FAFC',
        fontFamily: 'Inter',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        buttonStyles: {
            borderRadius: '0.75rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem'
        },
        productCard: {
            borderRadius: '1.5rem',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            hoverAnimation: 'scale-105',
            imageRatio: 'aspect-square'
        }
    });

    useEffect(() => {
        // Load language
        try {
            const savedLang = localStorage.getItem('azt-lang') as Language;
            if (savedLang && ['tr', 'en', 'de', 'fr'].includes(savedLang)) {
                setLanguageState(savedLang);
            }
        } catch (e) {
            console.error("Local storage error:", e);
        }

        // Fetch products
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/data/products');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Could not fetch products", e);
                setProducts([]);
            }
        };
        fetchProducts();

        // Fetch site settings
        const fetchSiteSettings = async () => {
            try {
                const res = await fetch('/api/data/site-settings');
                const data = await res.json();
                if (data && !data.error) {
                    setSiteSettings(prev => ({ ...prev, ...data }));
                }
            } catch (e) {
                console.error("Could not fetch site settings", e);
            }
        };
        fetchSiteSettings();

        // Fetch theme
        const fetchTheme = async () => {
            try {
                const res = await fetch('/api/theme');
                const data = await res.json();
                if (data && !data.error) {
                    setTheme(prev => ({ ...prev, ...data }));
                }
            } catch (e) {
                console.error("Could not fetch theme", e);
            }
        };
        fetchTheme();
    }, []);

    // Apply global CSS settings automatically
    useEffect(() => {
        if (!siteSettings || !theme) return;
        
        try {
            const root = document.documentElement;
            if (siteSettings.primaryColor) {
                root.style.setProperty('--primary', siteSettings.primaryColor);
            }
            if (theme.primaryColor) {
                // Merge fallback if not in site setting overrides
                root.style.setProperty('--primary', siteSettings.primaryColor || theme.primaryColor);
            }
        } catch (err) {
            console.error(err);
        }
    }, [siteSettings, theme]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem('azt-lang', lang);
        } catch (e) {
            // ignore
        }
    };

    const syncProducts = async (newProducts: Product[]) => {
        const safeProducts = Array.isArray(newProducts) ? newProducts : [];
        setProducts(safeProducts);
        try {
            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(safeProducts)
            });
            // Force re-fetch from dynamic data immediately to ensure frontend sees true state
            const r = await fetch('/api/data/products');
            const data = await r.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to sync products", e);
        }
    };

    const addProduct = (product: Product) => syncProducts([...(Array.isArray(products) ? products : []), product]);
    const deleteProduct = (id: string) => syncProducts((Array.isArray(products) ? products : []).filter(p => p?.id !== id));
    const updateProducts = (productsList: Product[]) => syncProducts(productsList);

    const updateSiteSettings = async (settings: SiteSettings) => {
        setSiteSettings(prev => ({ ...prev, ...settings }));
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings || {})
            });
        } catch (e) {
            console.error("Failed to update site settings", e);
        }
    }

    const updateTheme = async (newTheme: ThemeSettings) => {
        setTheme(prev => ({ ...prev, ...newTheme }));
        try {
            await fetch('/api/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTheme || {})
            });
        } catch (e) {
            console.error("Failed to update theme", e);
        }
    }

    const t = getTranslation(language || 'tr');

    return (
        <AppContext.Provider value={{
            products: Array.isArray(products) ? products : [],
            language: language || 'tr',
            setLanguage,
            addProduct,
            deleteProduct,
            updateProducts,
            t,
            siteSettings: siteSettings || {} as SiteSettings,
            updateSiteSettings,
            theme: theme || {} as ThemeSettings,
            updateTheme
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
