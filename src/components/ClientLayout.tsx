"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AppProvider, useAppContext } from '@/context/AppProvider';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { language, theme, siteSettings } = useAppContext();
    const isAdminPath = pathname?.startsWith('/secure-admin-login');

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = 'ltr';
    }, [language]);

    useEffect(() => {
        // Inject Theme CSS Variables
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--bg-color', theme.backgroundColor);
        root.style.setProperty('--font-family', theme.fontFamily);
        root.style.setProperty('--border-radius-xl', theme.borderRadius);
        root.style.setProperty('--shadow-soft', theme.boxShadow);
        
        // Button styles
        root.style.setProperty('--btn-radius', theme.buttonStyles.borderRadius);
        root.style.setProperty('--btn-padding', theme.buttonStyles.padding);
        root.style.setProperty('--btn-font-size', theme.buttonStyles.fontSize);

        // Product Card styles
        root.style.setProperty('--card-radius', theme.productCard.borderRadius);
        root.style.setProperty('--card-shadow', theme.productCard.shadow);
        
        // Favicon update
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon && siteSettings.favicon) {
            favicon.href = siteSettings.favicon;
        }
    }, [theme, siteSettings.favicon]);

    return (
        <div style={{ fontFamily: 'var(--font-family), sans-serif' }}>
            {!isAdminPath && <Navbar />}
            <main className="flex-1">
                {children}
            </main>
            {!isAdminPath && <Footer />}
        </div>
    );
}

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppProvider>
            <LayoutContent>{children}</LayoutContent>
        </AppProvider>
    );
}
